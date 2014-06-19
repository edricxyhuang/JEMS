from flask import Flask
from flask import render_template, session, request, redirect, url_for

app = Flask(__name__)
app.secret_key = "app"

client = MongoClient()
db = client['events']
events = db['events']

things = query_api(term, radius); 
## something like this? ^^

@app.route('/',methods=["POST","GET"])
def Home():
    if request.method == "GET":
        return render_template("index.html")
    if request.method == "POST":
        return redirect(url_for("/Home"));
    


if __name__=="__main__":
    app.debug=True
    app.run(host='0.0.0.0',port=7001)
