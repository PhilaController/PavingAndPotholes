from phila_streets.streets import load_streets_directory
from shapely.geometry import MultiLineString
import geopandas as gpd

EPSG = 4326


def get_street_networks():
    """
    Street networks
    """
    columns = ["network", "geometry", "street_name"]

    df = (
        load_streets_directory()
        .to_crs(epsg=EPSG)
        .assign(network=lambda df: df.network.replace({"Federal Aid Route": "FAM"}))
        .loc[:, columns]
        .dropna(subset=["street_name"])
        .groupby(["street_name", "network"])
        .geometry.apply(lambda x: MultiLineString(x.tolist()))
        .reset_index()
    )

    return gpd.GeoDataFrame(df, geometry="geometry", crs={"init": "epsg:4326"})


if __name__ == "__main__":

    # street networks
    with open("../src/data/street_networks.json", "w") as ff:
        ff.write(get_street_networks().to_json())
