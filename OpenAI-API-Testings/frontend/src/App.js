import './App.css';
import React, { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import axios from "axios";
import { Form, Formik } from "formik";
import SubmitButton from "./pageComponents/SubmitButton";
import { Field } from "formik";



function App() {
  // FORMIK
const INITIAL_FORM_STATE = {
  prompt: ""
};

  const [receivedPrompt, setReceivedPrompt] = useState("");

  return (
    <div className="App">
       <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
        <Formik
          initialValues={{ ...INITIAL_FORM_STATE }}
          onSubmit={async (values) => {
            console.log(values)
            await axios
              .post("http://localhost:8060/AI/processPrompt", {
                prompt: values.prompt // Use the correct field name
              })
              .then((response) => {
                setReceivedPrompt(response.data.bot);
                console.log(response);
              })
              .catch((err) => {
                console.log(err);
              });
          }}
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
            <TextField id="outlined-basic" name="APIresponse" label="Response" value={receivedPrompt} variant="outlined" style={{width:"1000px"}} multiline maxRows={300} rows={30}/>
            <SubmitButton>Update</SubmitButton>
        </Form>
      </Formik>
    </Box>

    </div>
  );
}

export default App;
