import streamlit as st
import pickle
import string
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

lemmatizer = WordNetLemmatizer()

def transform_text(text):
    text = text.lower()
    text = nltk.word_tokenize(text)

    y = []
    for i in text:
        if i.isalnum():
            y.append(i)  # removed special characters

    text = y[:]  # cloning
    y.clear()

    for i in text:
        if i not in stopwords.words('english') and i not in string.punctuation:
            y.append(i)

    text = y[:]
    y.clear()
    for i in text:
        y.append(lemmatizer.lemmatize(i))

    return " ".join(y)

cv = pickle.load(open('vectorizer.pkl', 'rb'))
model = pickle.load(open('model.pkl', 'rb'))

st.title("DARK PATTERN Classifier")
input_sms = st.text_input("Enter the message")
if st.button('Predict'):

    transformed_sms = transform_text(input_sms)
    st.write("Transformed Input:", transformed_sms)

    vector_input = cv.transform([transformed_sms])

    probabilities = model.predict_proba(vector_input)[0]
    st.write("Class Probabilities:", probabilities)

    result = model.predict(vector_input)[0]
    st.write("Model Prediction:", result)

    # Print unique class labels
    unique_labels = set(model.classes_)
    st.write("Unique Class Labels:", unique_labels)

    if result == 1:
        st.header("no")
    elif result == 2:
        st.header("yes")
    else:
        st.header("depends")
