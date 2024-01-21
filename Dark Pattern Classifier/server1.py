import pickle
from flask import Flask, jsonify
from markupsafe import escape
import app1

flaskapp = Flask(__name__)

cv = pickle.load(open('vectorizer.pkl', 'rb'))
model = pickle.load(open('model.pkl', 'rb'))


@flaskapp.route('/api/<text>', methods=["GET"])
def api(text):
    data = escape(text)
    transformed_sms = app1.transform_text(data)

    vector_input = cv.transform([transformed_sms])

    result = model.predict(vector_input)[0]
    print(result)
    pattern = {
        1: False,
        2: True,
        0: None,
    }

    resp = {
        "dark": pattern[result],
        "ok": True
    }

    return jsonify(resp)


if __name__ == '__main__':
    flaskapp.run(debug=True)
