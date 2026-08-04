import csv
import json

def csv2json(inputfile, outputfile):
    with open(inputfile, mode='r', newline='', encoding='utf-8-sig') as csvfile:
        data = list(csv.DictReader(csvfile))

    with open(outputfile, mode='w', encoding='utf-8-sig') as jsonfile:
        json.dump(data, jsonfile, indent=4)



if __name__ == '__main__':
    inpath = "input/IndicatorQuestions.csv"
    outpath = "questiondata/IndicatorQuestions.json"
    csv2json(inpath, outpath)