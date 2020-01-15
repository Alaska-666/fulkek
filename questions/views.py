from questions.models import Test, Question, Session
from questions.serializers import TestSerializer, QuestionSerializer, UserSerializer, SessionSerializer, UserSerializerWithToken
from rest_framework import generics, status, response, decorators, permissions, views
from django.db import transaction
from django.contrib.auth import authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.contrib.auth.models import User



class CreateTest(generics.ListCreateAPIView):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

    def create(self, request, *args, **kwargs):
        try:
            items_data = request.data['items']
        except KeyError:
            return response.Response({"questions": "not exists"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return response.Response({"test serializer":"error"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            serializer.save()
            for item in items_data:
                s = QuestionSerializer(data=item)
                if not s.is_valid():
                    return response.Response({"question serializer":"error"}, status.HTTP_400_BAD_REQUEST)
                s.save()
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        tests = Test.objects.all().values()
        for t in tests:
            t["items"] = Question.objects.filter(test=t["name"]).values()
        return response.Response(tests, status=status.HTTP_200_OK)


class GetTests(generics.ListAPIView):
    serializer_class = TestSerializer
    queryset = Test.objects.all()
    lookup_field = ['name', 'background']


class ReadTest(generics.ListAPIView):
    def list(self, request, *args, **kwargs):
        try:
            test_name = request.GET['name']
        except KeyError:
            return response.Response({"error": "'name' should be specified as url argument"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            test = Test.objects.filter(name=test_name).values()[0]
        except IndexError:
            return response.Response({"name": "'" + test_name + "' not found"}, status=status.HTTP_404_NOT_FOUND)

        test["items"] = list(sorted(Question.objects.filter(test=test_name).values(), key=lambda x: x["order"]))
        return response.Response(test, status=status.HTTP_200_OK)


class DeleteTest(generics.DestroyAPIView):
    def delete(self, request, *args, **kwargs):
        try:
            test_name = request.GET['name']
        except KeyError:
            return response.Response({"error": "'name' should be specified as url argument"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            test = Test.objects.get(name=test_name)
            test.delete()
        except Test.DoesNotExist:
            return response.Response({"name": "'" + test_name + "' not found"}, status=status.HTTP_404_NOT_FOUND)

        questions = Question.objects.filter(test=test_name)
        for question in questions:
            question.delete()
        return response.Response({"deleted": "ok"}, status=status.HTTP_200_OK)


class AddQuestion(generics.CreateAPIView):
    serializer_class = QuestionSerializer

    def create(self, request, *args, **kwargs):
        serializer = QuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response(serializer.data, status=status.HTTP_201_CREATED)


class DeleteQuestion(generics.DestroyAPIView):
    serializer_class = QuestionSerializer

    def delete(self, request, *args, **kwargs):
        try:
            test_name = request.GET['test_name']
        except KeyError:
            return response.Response({"error": "test not found"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            test_text = request.GET['test_text']
        except KeyError:
            return response.Response({"error": "text question not found"}, status=status.HTTP_400_BAD_REQUEST)

        question = Question.objects.get(test=test_name, text=test_text)
        question.delete()
        return response.Response({"deleted": "ok"}, status=status.HTTP_200_OK)


class UpdateQuestion(generics.UpdateAPIView):
    serializer_class = TestSerializer

    def update(self, request, *args, **kwargs):
        update_params = request.GET
        try:
            test_name = update_params['test_name']
        except KeyError:
            return response.Response({"error": "test not found"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            test_text = update_params['test_text']
        except KeyError:
            return response.Response({"error": "text question not found"}, status=status.HTTP_400_BAD_REQUEST)

        if 'background' in update_params.keys():
            Question.objects.filter(test=test_name, text=test_text).update(background=update_params['background'])

        if 'variants' in update_params.keys():
            Question.objects.filter(test=test_name, text=test_text).update(variants=update_params['variants'])

        if 'text' in update_params.keys():
            Question.objects.filter(test=test_name, text=test_text).update(text=update_params['text'])
        return response.Response({"updated": "ok"}, status=status.HTTP_200_OK)


class UpdateTest(generics.UpdateAPIView):
    serializer_class = QuestionSerializer

    def update(self, request, *args, **kwargs):
        update_params = request.GET

        try:
            name = update_params['name']
        except KeyError:
            return response.Response({"error": "test not found"}, status=status.HTTP_400_BAD_REQUEST)

        if 'background' in update_params.keys():
            Test.objects.filter(name=name).update(background=update_params['background'])

        if 'answers' in update_params.keys():
            Test.objects.filter(name=name).update(answers=update_params['answers'])
        return response.Response({"updated": "ok"}, status=status.HTTP_200_OK)


class ReadSessions(generics.ListAPIView):
    def list(self, request, *args, **kwargs):
        print("reading")
        user = request.user
        try:
            test = Session.objects.filter(user=user).values()
        except Session.DoesNotExist:
            return response.Response({"user": "'" + user.login + "' not found"}, status=status.HTTP_404_NOT_FOUND)
        return response.Response(test, status=status.HTTP_200_OK)


class UpdateSession(generics.CreateAPIView):
    serializer_class = SessionSerializer

    def create(self, request, *args, **kwargs):
        print("updating")
        request.data["user"] = User.objects.get(username=request.user.username).pk
        s = self.get_serializer(data=request.data)
        if not s.is_valid():
            return response.Response(s.errors, status.HTTP_400_BAD_REQUEST)
        s.save()
        return response.Response({"status": "ok"}, status.HTTP_200_OK)


@decorators.api_view(["GET"])
def current_user(request):
    serializer = UserSerializer(request.user)
    return response.Response(serializer.data)


class CreateUser(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def jwt_response_handler(token, user=None, request=None):
    return {
        "token": token,
        "user": UserSerializer(user, context={"request": request}).data
    }


def handle_not_found(request, *args, **kwargs):
    return redirect("/")