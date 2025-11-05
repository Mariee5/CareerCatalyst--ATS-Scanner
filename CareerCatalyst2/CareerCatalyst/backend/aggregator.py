import requests
from bs4 import BeautifulSoup

def fetch_internshala(role, location, job_type):
    # Build the search URL based on provided parameters
    base_url = "https://internshala.com/internships/"
    url = base_url
    if location and role:
        url += f"{location}-internship/jobs/{role}"
    elif location:
        url += f"{location}-internship"
    elif role:
        url += f"work-from-home-{role}-internship"
    else:
        url += "work-from-home-internship"

    jobs = []
    for page in range(1, 3):  # Scrape first 2 pages
        paged_url = url + (f"/page-{page}" if page > 1 else "")
        try:
            response = requests.get(paged_url, timeout=10)
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                for job_card in soup.find_all('div', class_='individual_internship'):
                    title_tag = job_card.find('div', class_='heading_4_5')
                    company_tag = job_card.find('a', class_='link_display_like_text')
                    link_tag = job_card.find('a', class_='view_detail_button')
                    desc_tag = job_card.find('div', class_='internship_other_details_container')
                    stipend_tag = job_card.find('span', class_='stipend')
                    start_date_tag = job_card.find('div', class_='start_immediately_desktop')
                    duration_tag = job_card.find('div', class_='other_detail_item duration')
                    title = title_tag.text.strip() if title_tag else 'N/A'
                    company = company_tag.text.strip() if company_tag else 'N/A'
                    link = f"https://internshala.com{link_tag['href']}" if link_tag and link_tag.has_attr('href') else ''
                    desc = desc_tag.text.strip() if desc_tag else ''
                    stipend = stipend_tag.text.strip() if stipend_tag else ''
                    start_date = start_date_tag.text.strip() if start_date_tag else ''
                    duration = duration_tag.text.strip() if duration_tag else ''
                    jobs.append({
                        'title': title,
                        'company': company,
                        'location': location or 'N/A',
                        'type': job_type or 'Internship',
                        'link': link,
                        'description': desc,
                        'stipend': stipend,
                        'start_date': start_date,
                        'duration': duration
                    })
        except Exception as e:
            # Log or handle error if needed
            pass
    return jobs

def fetch_glassdoor(role, location, job_type):
    # TODO: Implement Glassdoor scraping or API
    return []

def fetch_linkedin(role, location, job_type):
    # TODO: Implement LinkedIn scraping (not recommended due to TOS)
    return []

def fetch_indeed(role, location, job_type):
    # TODO: Implement Indeed scraping or API
    return [] 