# RAG
## Build an application with following tech stack -

1\. Frontend - **React**

2\. Backend - **Python with Langchain**

3\. LLM ( both embedding and retrieval) - **Gemini or Azure OpenAI**

## This application should have following features -

1\. App should have similar look and feel as the screenshot attached, if no screenshot is there then use modern color themes and make it look sleek and clean app

2\. Create 2 Tabs - Configuration and Chatbot

### 3\. In Configuration there are further 3 pages (Upload, LLM and Analytics)-

#### 3.1 In Upload -

3.1.1 Allow user to either upload files or connect to a Sharepoint (Allowed File types are - PDF, PPT, PPTX, DOC, DOCX, TXT, MD) to fetch the files and click "Next" button for next steps. This will form my Knowledge Base

3.1.2 It should vector embedding of the files uploaded, show progress bar for the same

3.1.3 Allow uploading of new files/SharePoint and create embeddings only for the changes done

3.2 In LLM -  
3.2.1 Allow users to switch between Gemini and Azure OpenAI by simply selecting the LLM and Providing key information needed to make the switch like endpoint and keys

3.3 In Analytics -  
3.2.1 Allow users to see basic metrics on chatbot usage

With this all Configurations are done

### 4\. In Chatbot -

4.1 Chatbot is where interaction with these files is possible.

4.2 Chatbot should have option to allow interaction either with only Knowledge Base or both Knowledge Base as well as LLM as well as place to provide Instructions which Chatbot should follow for answering any query

4.3 Only Knowledge Base - it should not allow LLM to provide answer beyond the files which were uploaded. Both Knowledge Base and LLM - it should allow the response to come primarily from knowledge base but if not found then from open internet

4.4. If a response is coming from Knowledge base identify which files were used to provide the answer, give them as reference below the response

