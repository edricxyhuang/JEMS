from flask import Flask
from flask import render_template, session, request, redirect, url_for
import json
from api import query_api

app = Flask(__name__)
app.secret_key = "app"



@app.route('/',methods=["POST","GET"])
def Home():
    
    if request.method == "GET":
        return render_template("index.html")
    if request.method == "POST":    
        term = request.form['term']
        radius = request.form['radius']
        location = request.form['location']
        venues = query_api(term, location, radius)
        #venues is a 2d list, i.e. [ [], [], [], ]
        # each sublist should be like [ [location_as_string, name_of_venue, snippet_img_url, snippet_text], [same_for_second_venue,etc,etc,etc], [], ] for each venue
        return render_template('directions.html', passed_venues = json.dumps(venues), start_loc = location);
    


if __name__=="__main__":
    app.debug=True
    app.run(host='0.0.0.0',port=7001)
