import requests
from bs4 import BeautifulSoup
import json

# Your search term (make sure it's specific)
search_term = 'Dans Cafe Adams Morgan'

def get_reviews():
    # Construct the Google search URL
    search_url = 'https://www.google.com/search?q=samsung+s20+ultra&oq=samsun&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7Mg8IARAuGCcYgAQY5QQYigUyDggCEEUYJxg7GIAEGIoFMhUIAxAuGEMYxwEYsQMY0QMYgAQYigUyBggEEEUYPDIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPNIBCDE3NTFqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8'

    # Set user-agent header to simulate a real browser request
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    # Send GET request to Google
    response = requests.get(search_url, headers=headers)

    # If the request is successful, parse the page
    if response.status_code == 200:
        page_content = response.content
        soup = BeautifulSoup(page_content, 'html.parser')

        # Parse and extract reviews or relevant information
        reviews = extract_reviews(soup)
        
        # Save the reviews in a JSON file
        save_data(reviews)
    else:
        print(f"Failed to retrieve data: {response.status_code}")

def extract_reviews(soup):
    # Example of extracting review data from the page (you need to adjust based on actual page structure)
    reviews = []

    # Adjust based on the HTML structure of the Google search results page
    review_elements = soup.find_all('div', class_='Mg54fc')  # Example for Google Search result listings
    
    for element in review_elements:
        try:
            revs = element.find('div',class_='I2QVJb')
            rev_el = revs.find('div',class_='hcYgnb')
            title = rev_el.find('aria-label',{'class':'z3HNkc'}).text 
            review = rev_el.find({'class': 'YKsAwb Kq2q2c'}).text 
            
            review_data = {
                "author_name": title,
                "review": review
            }
            reviews.append(review_data)
        except AttributeError:
            continue
    
    return reviews

def save_data(data):
    # Clean the search term for the file name
    search_name_formatted = search_term.replace(" ", '-').lower()

    # Save the data to a JSON file
    with open(f'{search_name_formatted}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Data saved in googreviews/googreview-{search_name_formatted}.json")

if __name__ == "__main__":
    get_reviews()
