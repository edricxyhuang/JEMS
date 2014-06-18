import argparse
import json
import pprint
import sys
import urllib
import urllib2

import oauth2

import hashlib #Source file: http://hg.python.org/cpython/file/2.7/Lib/hashlib.py
import time
import urllib

""" YELP API """
##Some of this code is borrowed from the Yelp API v2.0 code sample.

API_HOST = 'api.yelp.com'
DEFAULT_LOCATION = 'New York, NY'
DEFAULT_TERM = 'dinner'
SEARCH_LIMIT = 3
SEARCH_PATH = '/v2/search/'
BUSINESS_PATH = '/v2/business/'

##from one of Justin's old projects:
CONSUMER_KEY = 4EIHwPZt8DYZHqTXwm1A-Q
CONSUMER_SECRET = juXt69VHeOHgAKmpWt_OI5_6RDY
TOKEN = r5k7SUhaEg_TIcsrhv4V4BLLW2e5z8gC
TOKEN_SECRET = c3_YJgWWdCL6kNMD9ux7cFiJu9U


def request(host, path, url_params=None):
    url_params = url_params or {}
    encoded_params = urllib.urlencode(url_params)

    url = 'http://{0}{1}?{2}'.format(host, path, encoded_params)

    consumer = oauth2.Consumer(CONSUMER_KEY, CONSUMER_SECRET)
    oauth_request = oauth2.Request('GET', url, {})
    oauth_request.update(
        {
            'oauth_nonce': oauth2.generate_nonce(),
            'oauth_timestamp': oauth2.generate_timestamp(),
            'oauth_token': TOKEN,
            'oauth_consumer_key': CONSUMER_KEY
        }
    )
    token = oauth2.Token(TOKEN, TOKEN_SECRET)
    oauth_request.sign_request(oauth2.SignatureMethod_HMAC_SHA1(), consumer, token)
    signed_url = oauth_request.to_url()

    print 'Querying {0} ...'.format(url)

    conn = urllib2.urlopen(signed_url, None)
    try:
        response = json.loads(conn.read())
    finally:
        conn.close()

    return response

def search(term, radius):
    url_params = {
        'term': term,
        'radius': radius_filter,
        'limit': SEARCH_LIMIT
    }

    return request(API_HOST, SEARCH_PATH, url_params=url_params)

def get_business(business_id):
    
    business_path = BUSINESS_PATH + business_id

    return request(API_HOST, business_path)

def query_api(term, radius):
    
    response = search(term, radius)
    businesses = response.get('businesses')

    if not businesses:
        print 'No businesses for {0} in {1} found.'.format(term, location)
        return

    business_id = businesses[0]['id']

    print '{0} businesses found, querying business info for the top result "{1}" ...'.format(
        len(businesses),
        business_id
    )

    response = get_business(business_id)

    print 'Result for business "{0}" found:'.format(business_id)
    pprint.pprint(response, indent=2)


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument('-q', '--term', dest='term', default=DEFAULT_TERM, type=str, help='Search term (default: %(default)s)')
    parser.add_argument('-l', '--location', dest='location', default=DEFAULT_LOCATION, type=str, help='Search location (default: %(default)s)')

    input_values = parser.parse_args()

    try:
        query_api(input_values.term, input_values.location)
    except urllib2.HTTPError as error:
        sys.exit('Encountered HTTP error {0}. Abort program.'.format(error.code))

""" END OF YELP API """

""" FANDANGO API """
## Used example at https://developer.fandango.com/page/API__Sample_Code_Python as a base
## NOTE: we weren't able to use this code because we never got an api key


class FandangoApiManager(object):

    def __init__(self):
        self.FandangoApiManager = [ ]

    def Sha256Encode(self, stringToEncode):

        s = hashlib.sha256();
        s.update(stringToEncode)
        result = s.hexdigest()

        return result

    def BuildAuthorizationParameters(self, apiKey, sharedSecret):

        paramsToEncode = "{0}{1}{2}".format(apiKey, sharedSecret, int(time.time()))
        encodedParams = self.Sha256Encode(paramsToEncode)
        result = "apikey={0}&sig={1}".format(apiKey, encodedParams)
        
        return result

    def GetResponse(self, parameters):

        baseUri = "http://api.fandango.com"
        apiVersion = "1"

        ## we requested an api key but never got one
        
        apiKey = "your_api_key"
        sharedSecret = "your_shared_secret"

        authorizationParameters = self.BuildAuthorizationParameters(apiKey, sharedSecret)
        requestUri = "{0}/v{1}/?{2}&{3}".format(baseUri, apiVersion, parameters, authorizationParameters)

        response = urllib.urlopen(requestUri)
        
        result = response.read()
        
        return result


def main():
    
    api = FandangoApiManager()
    
    zipCode = "90064";
    parameters = "op=theatersbypostalcodesearch&postalcode={0}".format(zipCode)

    responseFromServer = api.GetResponse(parameters)

    print responseFromServer

""" END OF FANDANGO API """

""" NYT API """

## we also requested a NYT api key and never got one

""" END OF NYT API """

if __name__ == '__main__':
    main()