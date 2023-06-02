FROM python:3.8

ENV PYTHONUNBUFFERED 1

ADD . /app

WORKDIR /app

RUN pip3 install -r requirements.txt

RUN python3 manage.py makemigrations

RUN python3 manage.py migrate

CMD python3 manage.py runserver 0.0.0.0:8000