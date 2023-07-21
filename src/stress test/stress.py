from selenium import webdriver
from selenium.webdriver.common.by import By
options = webdriver.ChromeOptions()
# options.add_argument("--headless")
options.add_experimental_option("detach", True)

driver = webdriver.Chrome(options=options)    # Chrome浏览器

# 打开网页
# driver.get("https://paulduangithub.github.io/uts-interactive") # 打开url网页
driver.get("http://127.0.0.1:3000/uts-interactive") # 打开url网页
input = driver.find_element(By.TAG_NAME,"input")
input.send_keys("TEST")
button = driver.find_element(By.TAG_NAME,"button")
button.click()