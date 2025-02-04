#include <string>

using namespace std;

#ifndef HTTP_CONNECTION_TYPES
#define HTTP_CONNECTION_TYPES

const char* HTTPConnectionTypes[4]={
    "POST_HTTP_OPERATION",
    "GET_HTTP_OPERATION",
    "PUT_HTTP_OPERATION",
    "DELETE_HTTP_OPERATION"
};

#endif