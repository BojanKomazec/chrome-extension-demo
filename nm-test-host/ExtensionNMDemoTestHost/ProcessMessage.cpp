#include "third-party/json/json-forwards.h"
#include "third-party/json/json.h"
#include "include/ProcessMessage.h"
//#include "Windows.h" //ExitWindowsEx

// Edit this file to handle more incoming_message message from chromium browser

// 
// Incoming message:
// {
//     "text" : "some_request"
// }

bool ExtractRequest(const std::vector<char>& incoming_message, std::string& request) {
    auto is_success = false;
    Json::Value root;
    Json::Reader reader;

    is_success = reader.parse(&incoming_message[0], root);

    if (is_success) {
        auto incoming_message = root.toStyledString();
        //OutputDebugString(L"Incoming message: ");
        //OutputDebugStringA(incoming_message.c_str());
        request = root.get("text", "").asString();
    }

    return is_success;
}

bool ProcessRequest(const std::string& request, std::vector<char>& response, bool& isExitRequested) {
    auto is_success = false;

    if (request.length() > 0) {
        if (request == "logoff_windows") {
            //ExitWindowsEx(EWX_LOGOFF, 0);
        }
        else if (request == "colours") {
            Json::Value root;
        
            Json::Value colours(Json::arrayValue);
            colours.append(Json::Value("White"));
            colours.append(Json::Value("Yellow"));
            colours.append(Json::Value("Beige"));
            colours.append(Json::Value("Aquamarin"));

            root[request] = colours;

            //std::string json = root.toStyledString();
            Json::StreamWriterBuilder wbuilder;
            wbuilder["indentation"] = "";
            //std::cout << "'" << Json::writeString(wbuilder, root) << "'" << std::endl;
            std::string json = Json::writeString(wbuilder, root);

            //OutputDebugStringA(json.c_str());

            response.resize(json.length() + 1);
            std::copy(json.c_str(), json.c_str() + json.length() + 1, response.begin());

        } else if (request == "exit") {
            isExitRequested = true;

            Json::Value outgoing_json;
            outgoing_json[request] = "NM Host will shut down...";
            std::string json = outgoing_json.toStyledString();
            response.resize(json.length() + 1);
            std::copy(json.c_str(), json.c_str() + json.length() + 1, response.begin());
        } else if (request == "get_api_version") {
            Json::Value outgoing_json;
            outgoing_json[request] = "1.0";
            std::string json = outgoing_json.toStyledString();
            response.resize(json.length() + 1);
            std::copy(json.c_str(), json.c_str() + json.length() + 1, response.begin());
        }
        else { // echo request 
            Json::Value outgoing_json;
            outgoing_json["unrecognized_request"] = request;
            std::string json = outgoing_json.toStyledString();
            response.resize(json.length() + 1);
            std::copy(json.c_str(), json.c_str() + json.length() + 1, response.begin());
        }

        is_success = true;
    }

    return is_success;
}
