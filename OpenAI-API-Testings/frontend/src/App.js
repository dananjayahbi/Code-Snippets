import "./App.css";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import axios from "axios";
import { Form, Formik } from "formik";
import SubmitButton from "./pageComponents/SubmitButton";
import { Field } from "formik";

function App() {
  const INITIAL_FORM_STATE = {
    prompt: ""
  };

  const [receivedPrompt, setReceivedPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [showCustomSend, setShowCustomSend] = useState(false);

  //Continue generating button submission
  const handleSubmit = async (values) => {
    setIsTyping(true);
    setReceivedPrompt((prevPrompt) => prevPrompt ? prevPrompt + " Generating..." : "Generating...");
  
    try {
      const response = await axios.post("http://localhost:8060/AI/processPrompt", {
        conversation: conversation,
        prompt: values.prompt
      });
  
      const botResponse = response.data.bot.trim();
      const updatedConversation = [
        ...conversation,
        { user: values.prompt, bot: botResponse }
      ];
  
      setConversation(updatedConversation);
      setReceivedPrompt((prevPrompt) => prevPrompt.replace(" Generating...", "") + " " + botResponse);
      setShowCustomSend(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsTyping(false);
      setReceivedPrompt((prevPrompt) => prevPrompt.replace(" Generating...", "")); // Remove "Generating..." text
    }
  };
  
  
  
  
  
  //Send button submission
  const handleSubmit2 = async (values) => {
    setIsTyping(true);
    setReceivedPrompt("Generating..."); // Display "Generating..." in the text field
  
    try {
      const response = await axios.post("http://localhost:8060/AI/processPrompt", {
        conversation: conversation,
        prompt: values.prompt
      });
  
      const botResponse = response.data.bot.trim();
      const updatedConversation = [
        ...conversation,
        { user: values.prompt, bot: botResponse }
      ];
      setReceivedPrompt(""); // Clear the "Generating..." text
      setConversation(updatedConversation);
      await typeText(botResponse);
    } catch (error) {
      console.log(error);
    } finally {
      setIsTyping(false);
      setShowCustomSend(true);
    }
  };
  

  const typeText = async (text) => {
    for (let i = 0; i < text.length; i++) {
      setReceivedPrompt((prevPrompt) => prevPrompt + text[i]);
      await sleep(20); // Adjust the typing speed as desired
    }
  };

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const handleCustomSubmit = () => {
    handleSubmit({ prompt: "continue generating" });
  };

  return (
    <div className="App">
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" }
        }}
        noValidate
        autoComplete="off"
      >
        <Formik
          initialValues={{ ...INITIAL_FORM_STATE }}
          onSubmit={handleSubmit2}
        >
          <Form>
            <Field
              as={TextField}
              id="outlined-basic"
              name="prompt"
              label="Enter the prompt"
              variant="outlined"
              style={{ width: "1000px", marginBottom: "20px" }}
              multiline
              maxRows={300}
            />
            <TextField
              id="outlined-basic"
              name="APIresponse"
              label="Response"
              value={isTyping ? receivedPrompt + "|" : receivedPrompt}
              variant="outlined"
              style={{ width: "1000px" }}
              multiline
              maxRows={300}
              rows={30}
            />
            <SubmitButton>Send</SubmitButton>
            {showCustomSend && (
              <button type="button" onClick={handleCustomSubmit}>
                Continue Generating
              </button>
            )}
          </Form>
        </Formik>

        {/* Conversation History */}
        <Box sx={{ mt: 2 }}>
          {conversation.map((message, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#f5f5f5",
                p: 2,
                mb: 2,
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <span style={{ fontWeight: "bold" }}>User:</span>
              <span>{message.user}</span>
              <span style={{ fontWeight: "bold", marginTop: "8px" }}>Bot:</span>
              <span>{message.bot}</span>
            </Box>
          ))}
        </Box>
      </Box>
    </div>
  );
}

export default App;