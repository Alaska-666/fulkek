from rest_framework import serializers
from questions.models import Test, Question, Session
from django.contrib.auth.models import User

from rest_framework_jwt.settings import api_settings


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["order", "test", "background", "text", "variants"]

    def validate(self, data):
        if Test.objects.get(name=data["test"]) is None:
            raise serializers.ValidationError("non existing test in question")
        return data


class TestSerializer(serializers.ModelSerializer):
    items = QuestionSerializer(many=True, read_only=True)
    class Meta:
        model = Test
        fields = ["items", "name", "background", "answers"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username",)


class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        payload = api_settings.JWT_PAYLOAD_HANDLER
        encode = api_settings.JWT_ENCODE_HANDLER
        p = payload(obj)
        token = encode(p)
        return token

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        instance = self.Meta.model(**validated_data)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ("token", "username", "password")


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ("test", "current", "status", "statistics", "user")

    def create(self, validated_data):
        print(validated_data)
        obj = Session.objects.filter(user=validated_data["user"], test=validated_data["test"])
        if len(obj) > 0:
            obj.update(**validated_data)
            return obj.first()
        return Session.objects.create(**validated_data)