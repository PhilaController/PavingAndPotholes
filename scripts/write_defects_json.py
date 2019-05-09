from phila_streets.potholes import load_requests_by_street, load_orders_by_street
import pandas as pd

EPSG = 4326
COLUMNS = ["lat", "lng", "date", "hood", "kind", "count", "street"]


def get_requests():
    """
    Load the street defect requests
    """

    return (
        load_requests_by_street()
        .to_crs(epsg=EPSG)
        .assign(
            lng=lambda df: df.geometry.x,
            lat=lambda df: df.geometry.y,
            date=lambda df: df["request_date"].dt.strftime("%Y-%m-%d %H:%M:00"),
            kind="request",
            count=0,
        )
        .rename(columns={"hood_name": "hood", "street_name": "street"})
        .loc[:, COLUMNS]
    )


def get_orders():
    """
    Load the street defect requests
    """
    columns = ["lat", "lng", "date", "count", "hood", "street", "id", "kind", "count"]
    return (
        load_orders_by_street()
        .to_crs(epsg=EPSG)
        .assign(
            lng=lambda df: df.geometry.x,
            lat=lambda df: df.geometry.y,
            date=lambda df: df["work_order_date"].dt.strftime("%Y-%m-%d %H:%M:00"),
            kind="order",
            count=lambda df: df["num_potholes"].fillna(1),
            test=lambda df: df.duplicated(subset="work_order_id"),
        )
        .query("test == False")
        .rename(columns={"hood_name": "hood", "street_name": "street"})
        .assign(street=lambda df: df["street"].fillna(""))
        .loc[:, COLUMNS]
    )


if __name__ == "__main__":

    # load
    requests = get_requests()
    orders = get_orders()

    # combine and drop missing
    df = pd.DataFrame(
        pd.concat([requests, orders], axis=0).dropna(
            subset=["hood", "lat", "lng"], how="any"
        )
    )

    # save
    df.to_json("../src/data/street_defects.json", orient="records")
    df.to_json("../src/data/compressed/data.json", orient="records", compression="gzip")
