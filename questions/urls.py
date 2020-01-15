from django.urls import path, re_path
from django.contrib.admin.views.decorators import staff_member_required
from questions.views import *
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    path("create/", staff_member_required(CreateTest.as_view())),
    path("delete/", staff_member_required(DeleteTest.as_view())),
    path("add_question/", staff_member_required(AddQuestion.as_view())),
    path("delete_question/", staff_member_required(DeleteQuestion.as_view())),
    path("update_question/", staff_member_required(UpdateQuestion.as_view())),
    path("update_test/", staff_member_required(UpdateTest.as_view())),
    path("read/", ReadTest.as_view()),
    path("readall/", GetTests.as_view()),
    path("sessions/", ReadSessions.as_view()),
    path("users/", CreateUser.as_view()),
    path("session/", UpdateSession.as_view()),
    path("token_auth/", obtain_jwt_token),
    path("current_user/", current_user),
    re_path(r".*/", handle_not_found)
]
handler404 = handle_not_found
