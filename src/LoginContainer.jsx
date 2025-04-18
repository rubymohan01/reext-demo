import React, { useEffect, useState } from "react";
import ReExt from "@sencha/reext";
import './login.css';
import { useNavigate } from "react-router-dom";
const LoginContainer = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL;
  // const defaultUsername = import.meta.env.VITE_DEFAULT_USERNAME;
  // const defaultPassword = import.meta.env.VITE_DEFAULT_PASSWORD;

  useEffect(() => {
    const removeWatermark = () => {
      const container = document.querySelector('div[name="ReExtRoot-form"]');
      if (!container) {
        console.warn("Container with name 'ReExtRoot-form' not found.");
        return;
      }

      const secondDiv = container.children[1];
      if (secondDiv) {
        const text = secondDiv.innerText.trim();
        if (text === "ReExt form") {
          secondDiv.remove();
        }
      }
    };

    setTimeout(removeWatermark, 100);
  }, []);

  const handleLogin = async (form) => {
    const url = `${apiUrl}/app/login`;
    const formData = form.getValues();
    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.username,
          password: formData.password
        })
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Login successful");
        onLoginSuccess();
        navigate("/");
      } else {
        console.log("Login failed");
        setMessage(data.message || 'Wrong username or password');
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage('An error occurred during login');
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "600px !important",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          paddingTop: "70px",
          color: "white",
        }}
      >
        <ReExt
          xtype="form"
          style={{
            WebkitAppearance: "none",
            boxShadow: "0 10px 20px rgb(189 191 175 / 93%)",
            borderRadius: "10px",
          }}
          config={{
            width: 450,
            height: 550,
            bodyPadding: 20,
            shadow: false,
            bodyStyle: {
              backgroundColor: "#FFFFFF !important",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            },
            color: "#000000",
            layout: {
              type: "vbox",
              align: "center",
              pack: "center",
            },
            items: [
              {
                xtype: "container",
                layout: "vbox",
                width: "80%",
                margin: "0 0 20 0",
                alignItems: 'center',
                items: [
                  {
                    xtype: "container",
                    html: "<div style='color:#FFA559;font-size:22px;font-weight:bold;margin-bottom:30px;text-align:center;width:100%;'>LogIn to CryptoInsights</div>",
                    style: {
                      width: "100%"
                    }
                  }
                ]
              },
              {
                xtype: "container",
                layout: "vbox",
                width: "80%",
                margin: "0 0 20 0",
                items: [
                  {
                    xtype: "label",
                    html: "Username",
                    style: {
                      marginBottom: "5px",
                      marginTop: "30px",
                      color: "#FFA559",
                      fontSize: "18px",
                    },
                  },
                  {
                    xtype: "textfield",
                    name: "username",
                    placeholder: "Enter your username",
                    allowBlank: false,
                    vytype: 'email',
                    validation: 'oh No!',
                    width: 300,
                    style: {
                      color: "#000000",
                    },
                    inputAttrTpl: {
                      style:
                        "color: #000000; font-size: 14px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;",
                    },
                  },
                ],
              },
              {
                xtype: "container",
                layout: "vbox",
                width: "80%",
                margin: "0 0 20 0",
                items: [
                  {
                    xtype: "label",
                    html: "Password",
                    style: {
                      marginBottom: "5px",
                      color: "#FFA559",
                      fontSize: "18px",
                    },
                  },
                  {
                    xtype: "textfield",
                    name: "password",
                    inputType: "password",
                    placeholder: "Enter your password",
                    allowBlank: false,
                    width: 300,
                    style: {
                      color: "#000000",
                    },
                    inputAttrTpl: {
                      style:
                        "color: #000000; font-size: 14px; padding: 8px; border: 1px solid #ccc; border-radius: 4px;",
                    },
                  },
                  {
                    xtype: 'checkboxfield',
                    name: 'pwdvisible',
                    boxLabel: 'View Password',
                    handler: function () {
                      let pwdField = this.previousSibling();
                      pwdField.inputEl.dom.type = (this.checked) ? 'text' : 'password'
                    }
                  },
                ],
              },
              {
                xtype: "container",
                layout: "hbox",
                width: "80%",
                margin: "20 0 0 0",
                items: [
                  {
                    xtype: "button",
                    text: "Login",
                    flex: 1,
                    margin: "0 10 0 0",
                    color: "red",
                    style: {
                      padding: "10px",
                      borderRadius: "4px",
                      backgroundColor: "#FFA559 !important",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    },
                    handler: function () {
                      const form = this.up('form').getForm();
                      handleLogin(form);
                    }
                  },
                ],
              },
              {
                xtype: "container",
                layout: "fit",
                width: "100%",
                height: 20,
                margin: "10 0",
                items: [{
                  xtype: "component",
                  html: message && message,
                  style: {
                    color: "red",
                    fontSize: "14px",
                    textAlign: "center"
                  }
                }]
              }
            ],
          }}
        />
        {message && (
          <div style={{ color: "red", marginTop: "10px" }}>{message}</div>
        )}
      </div>
    </>
  );
};
export default LoginContainer;