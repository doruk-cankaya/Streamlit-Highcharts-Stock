import os
import streamlit.components.v1 as components
import pandas as pd
import numpy as np
import json
import streamlit as st
import time


## This parameter sets React path 
# For use build version, set ->  _RELEASE = True

_RELEASE = True

if _RELEASE:
    root_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(root_dir, "frontend/build")

    _st_highcharts = components.declare_component(
        "st_highcharts",
        path=build_dir
    )
else:
    _st_highcharts = components.declare_component(
        "st_highcharts",
        url="http://localhost:3001"
    )


# Streamlit display settings
st.set_page_config(layout="wide")


jdata_file = "aapl-ohlcv.json"
def jsonFileReader(url):
    fileObject = open(url, "r")
    jsonContent = fileObject.read()
    return json.loads(jsonContent)

def readDf(df):
    df['ts'] = pd.to_datetime(df.Date).values.astype('int64')/10**6
    
    dfA = df[['ts','Open', 'High','Low','Close','Volume']]

    return dfA.to_json(orient='values')

filePath = "./XU100.csv"
def csvReader(df):
    df2json = readDf(df)
    df2json = df2json.replace('],', '],\n')
    df2json = df2json.replace(']]',']\n]')
    return json.loads(df2json)

def st_highcharts(jdata, name="Doruk", annot=[], key=None):
    return _st_highcharts(name=name, jdata=jdata, annot=annot)

json_list = []

line='{"langKey":"segment","type":"crookedLine","typeOptions":{"xAxis":0,"yAxis":0,"points":[{"x":1633756244210.5261,"y":3.7161290322580647,"xAxis":0,"yAxis":0,"controlPoint":{"symbol":"circle","width":10,"height":10,"style":{"cursor":"pointer","fill":"#ffffff","stroke":"#000000","stroke-width":2},"visible":false,"events":{}}},{"x":1637239073684.2104,"y":3.9506203473945414,"xAxis":0,"yAxis":0,"controlPoint":{"symbol":"circle","width":10,"height":10,"style":{"cursor":"pointer","fill":"#ffffff","stroke":"#000000","stroke-width":2},"visible":false,"events":{}}}]},"animation":{"defer":0}}'
json_list.append(json.loads(line))

lines=json.dumps(json_list)
## Following Line for Observing old Annotations on streamlit
st.code(lines)

with open('annot.js') as dataFile:
    data = dataFile.read()

# Reading dataframe
df = pd.read_csv(filePath,header=0)

gData = csvReader(df)

# highChart Stock Component
highChartAnnot = st_highcharts(name="XU100", jdata=gData, annot=data)

st.code(str(highChartAnnot),language="json")


st.code(data)



