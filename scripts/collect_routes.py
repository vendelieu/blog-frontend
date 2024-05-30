import requests
from pathlib import Path

# Base URL for the API
BASE_URL = "https://vendeli.eu/api/posts"

# Function to get data from API
def fetch_data(page_num):
    response = requests.get(f"{BASE_URL}?page={page_num}&sort_by=newest")
    response.raise_for_status()  # Raise an exception for HTTP errors
    return response.json()

# Function to extract slugs and write them to a file
def write_slugs_to_file(slugs):
    p = Path(__file__).with_name('routes.txt')
    with p.open("w") as file:
        # Writing the initial entries
        file.write("/\n")
        file.write("/projects\n")
        file.write("/about\n")

        # Writing the extracted slugs
        for slug in slugs:
            file.write(f"/post/{slug}\n")

def main():
    page_num = 1
    all_slugs = []

    while True:
        data = fetch_data(page_num)
        if not data["data"]:  # Check if the data array is empty
            break
        for item in data["data"]:
            all_slugs.append(item["slug"])
        page_num += 1

    # Write all collected slugs to the file
    write_slugs_to_file(all_slugs)

if __name__ == "__main__":
    main()
