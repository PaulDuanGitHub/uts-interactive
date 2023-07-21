from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait as wait
from selenium.webdriver.support import expected_conditions as EC

# url = "https://paulduangithub.github.io/uts-interactive"
url = "http://127.0.0.1:3000/uts-interactive"
options = webdriver.ChromeOptions()
# options.add_argument("--headless")
options.add_argument("--window-size=500,281")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option("detach", True)
driver = webdriver.Chrome(options=options)

driver.get(url)

driver.set_window_position(0,0)
input = driver.find_element(By.TAG_NAME,"input")
input.send_keys("TEST")
button = driver.find_element(By.TAG_NAME,"button")
button.click()
driver.execute_script("window.scrollTo(document.body.scrollWidth, document.body.scrollHeight/2.5);")

list = [510,0,1020,0,0,285,510,285,1020,285,0,570,510,570,1020,570]
for i in range(0,4,2):
    driver.switch_to.new_window('window')
    driver.get(url)

    driver.set_window_position(list[i],list[i+1])
    input = driver.find_element(By.TAG_NAME,"input")
    input.send_keys("TEST " + str(i))
    button = driver.find_element(By.TAG_NAME,"button")
    button.click()
    driver.execute_script("window.scrollTo(document.body.scrollWidth, document.body.scrollHeight/2.5);")