from phila_streets.streets import load_streets_directory
from phila_streets.paving import (
    load_resurfacing_history,
    load_resurfacing_2018,
    FT_TO_MILES,
)
from shapely.geometry import MultiLineString
import geopandas as gpd
import pandas as pd

EPSG = 4326

history = load_resurfacing_history().to_crs(epsg=EPSG)
last_year = load_resurfacing_2018().to_crs(epsg=EPSG)
streets = load_streets_directory().to_crs(epsg=EPSG)


def get_miles_paved_by_network():
    """
    Save the number of paved miles per year for the Local + FAM paving
    """
    networks = ["Local", "Federal Aid Route"]
    cols = ["network", "work_year", "segment_id", "length"]

    return (
        pd.concat([history[cols], last_year[cols]], axis=0)
        .query("network == @networks")
        .assign(network=lambda df: df.network.replace({"Federal Aid Route": "FAM"}))
        .groupby(["work_year", "network"])["length"]
        .sum()
        .to_frame()
        .reset_index()
        .assign(
            network=lambda df: df.network.astype(str),
            length=lambda df: df.length * FT_TO_MILES,
        )
        .rename(columns={"work_year": "year", "length": "total"})
    )


def get_paved_streets():
    """
    Paved street segments by paving date
    """

    df = pd.merge(
        history[["segment_id", "work_year"]], streets, on="segment_id", how="outer"
    )

    last_year["planned_2018"] = 1
    df = pd.merge(
        df, last_year[["segment_id", "planned_2018"]], on="segment_id", how="left"
    )

    columns = [
        "work_year",
        "network",
        "geometry",
        "street_name",
        "planned_2018",
        "block_number",
    ]
    df = (
        df.assign(network=lambda df: df.network.replace({"Federal Aid Route": "FAM"}))
        .loc[:, columns]
        .dropna(subset=["street_name"])
        .fillna(0)
    )
    df = gpd.GeoDataFrame(df, geometry="geometry")

    sel = (df["work_year"] == 0) & (df["planned_2018"] == 0)
    X = df.loc[sel]
    base = (
        X.groupby(["street_name", "network"])
        .geometry.apply(lambda x: MultiLineString(x.tolist()))
        .reset_index()
    )

    df = pd.concat([df.loc[~sel], base], sort=False)
    df["block_number"] = df["block_number"].fillna(-1)
    return df.fillna(0)


if __name__ == "__main__":

    # number of miles paved per year
    get_miles_paved_by_network().to_json(
        "../src/data/miles_paved.json", orient="records"
    )

    # paved streets
    with open("../src/data/paved_streets.json", "w") as ff:
        ff.write(get_paved_streets().to_json())
