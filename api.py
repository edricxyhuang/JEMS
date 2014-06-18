from flask import Flask
from flask_oauth import OAuth
from flask import session, url_for, redirect, render_template, request, flash
import urllib2
import oauth2
import json

app = Flask(__name__)


#address is a string in the form of {street address, neighborhood, city, or state}
#service is a string
###All ' ' must be instead '+'
def yelpAPI(address,service,limit):

    ##########################################################
    # Borrowed from Yelp oauth help files                    #
    # https://github.com/Yelp/yelp-api/tree/master/v2/python #
    ##########################################################
    

    # following values unique to our group ############
    consumer_key = '4EIHwPZt8DYZHqTXwm1A-Q'           #
    consumer_secret = 'juXt69VHeOHgAKmpWt_OI5_6RDY'   #
    token = 'r5k7SUhaEg_TIcsrhv4V4BLLW2e5z8gC'        #
    token_secret = 'c3_YJgWWdCL6kNMD9ux7cFiJu9U'      #
    # end of values ###################################
    
    consumer = oauth2.Consumer(consumer_key, consumer_secret)


    ### following code customized by our group


    #limit = 1; #number of results returned

    url = 'http://api.yelp.com/v2/search?term=%s&location=%s&limit=%d&format=json'%(service, address, limit)


    ### end of customized code 
    

    #print 'URL: %s' % (url,)


    oauth_request = oauth2.Request('GET', url, {})
    oauth_request.update({'oauth_nonce': oauth2.generate_nonce(),
                          'oauth_timestamp': oauth2.generate_timestamp(),
                          'oauth_token': token,
                          'oauth_consumer_key': consumer_key})

    token = oauth2.Token(token, token_secret)
    oauth_request.sign_request(oauth2.SignatureMethod_HMAC_SHA1(), consumer, token)
    signed_url = oauth_request.to_url()
    
    #print 'Signed URL: %s' % (signed_url,)
    
    ############################
    # End of borrowed code     #
    ############################
    
    return signed_url


def testURL(url):
    connection = urllib2.urlopen(url)
    response = json.load(connection)
    connection.close()
    return response


#returns list of dicts
#each dict has keys
#'name' = <name of place>
#'address' = <(string) address of place>
def getNameAddress(service, curAddress, numOfReturnedBusinesses):
    url = yelpAPI(curAddress, service, numOfReturnedBusinesses)
    response = testURL(url)

    buses = response["businesses"]
    businesses = []
    
    i = 0
    for elem in buses:
        addressList = response["businesses"][i]["location"]["display_address"]
        
        addr = ""
        for ad in addressList:
            #addr = str(addressList[0] + " " + addressList[2] + " " + addressList[3])
            if ad[0] != '(':
                addr += ad + " " 
            

        busDict = {}
        busDict["address"] = str(addr)
        busDict["name"] = response["businesses"][i]["name"]

        if "image_url" in response["businesses"][i]:
            busDict["img_url"] = str(response["businesses"][i]["image_url"])
        else:
            busDict["img_url"] = ""

        #print busDict["img_url"]

        businesses.append(busDict)
        i = i + 1

    return businesses
        
#e.g. call of getNameAddress()    
#print getNameAddress("cafe", "245 West 80th St New York, NY", 3)  
    
getNameAddress("cafe", "New York City", 5)