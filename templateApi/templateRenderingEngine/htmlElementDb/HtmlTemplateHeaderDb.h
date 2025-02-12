#include <unordered_map>
#include <string>

using namespace std;

#ifndef HTML_TEMPLATE_BASE_DB
#define HTML_TEMPLATE_BASE_DB

#include "BaseHTMLDb.h"

class HtmlTemplateBaseDb : public BaseHTMLDb{
    public:
        HtmlTemplateBaseDb(unordered_map<string, string> db) : BaseHTMLDb(db)
{
    this->db["emailDefaultHeader"]=R"(
            <!DOCTYPE html>
            <html>
            <head>
                <base target="_top">
                <style>
                body{
                    background-color:#E4EFE2;
                    margin:2em;
                }
                section{
                    background-color:white;
                    border-top:1em solid #5B9A48;
                    border-radius: 0.5em;
                    margin:0.5em;
                    padding:1em;
                    border-left: 0.5px solid gray;
                    border-right: 0.5px solid gray;
                    border-bottom: 0.5px solid gray;
                }
                #unsubscribeBtn{
                    background-color:#5B9A48;
                    border: 0px;
                    color:white;
                    border-radius:0.4em;
                    padding:0.5em;
                    text-align:center;
                    text-decoration:none;
                }
                </style>
            </head>
            <body>
                <section>
                <-[heading]-{templateHeadline}->
                    <hr/>
            )";

            this->db["emailDefaultFooter"] = R"(
                <hr/>
            <a id="unsubscribeBtn" href={{emailUrl}}>Unsubscribe</a>
            </section>
        </body>
            )";
        }
        string HtmlTemplateBaseDb::GetHtmlTemplateHeader(string keyToElType)
        {
            return GetHTMLDb(keyToElType);
        };
};

#endif