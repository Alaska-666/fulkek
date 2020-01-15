from django.db import models
from django.contrib.auth.models import User


class Test(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    background = models.ImageField(null=True)
    answers = models.CharField(max_length=400) # e. g. Blum Stela Flora
    # https://stackoverflow.com/a/58234663


class Question(models.Model):
    order = models.IntegerField()
    test = models.CharField(max_length=100)
    background = models.IntegerField(null=True)
    text = models.CharField(max_length=400)         # e. g. Do you love Blum? Do you want to fuck Stela? Are you gay?
    variants = models.CharField(max_length=400)     # yes, no, pidora otvet


class Session(models.Model):
    id = models.IntegerField(primary_key=True)
    CHOICES_ENUM = [("done", "test is answered"), ("running", "test is running now")]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    test = models.CharField(max_length=100)
    current = models.IntegerField()
    status = models.CharField(choices=CHOICES_ENUM, max_length=100)
    statistics = models.CharField(max_length=400) # current stat e. g. Blum = 5 Stela = 3 Flora = 1