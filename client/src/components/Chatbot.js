import React, { useState, useRef } from "react";
import "./Chatbot.css";


// data of thesis to configure if new thesis are added.
// applications
const thesisDataAPP = {
  Websites: [
    "Web-Based Equipment Maintenance Monitoring System for DHVSU Facilities",
    "PALENGKIHAN",
    "CODEQUEST",
    "Monitoring System for DHVSU Facilities",
    "Taskgrove",
    "MSWD Online Financial Assistance",
    "HTEFinder",
    "COMPAWNION",
    "COURSEDIRECT",
    "ACCREFILE",
    "CROPTURE",
    "WEB-BASED ELECTRONIC VOTING SYSTEM",
    "KDF AMBULATORY",
    "WEB-BASED RECORD AND INFO",
    "MATH-TINIK",
    "WEB-BASED HEALTH RECORD MANAGEMENT SYSTEM",
    "VACXINE",
    "ONE PUHUNAN",
    "WEB-APP INQUIRY IN BALE DE ANGELES",
    "MAMALAKAYA",
    "ALUMNI PORTAL",
    "WEB-BASED RECORD MANAGEMENT OF GAD",
    "COMPAN",
    "ASSEMBLE",
    "CODE QUEST",
  ],

  MobileApplication: [
    "B-SMART",
    "CARE",
    "CARLOS FITNESS",
    "FUZZY LOGIC BASED MOBILE APP",
    "SMS ANDROID APP SPEECH TO TEXT CONVERTER",
    "HYDRAFEEL",
    "AGKAS",
    "ARAL",
    "HanAp",
    "TRAVI",
    "KULTURA PH",
    "LOG;C",
    "KIDDONATOR",
    "ISKRABOL",
    "MYHEALTH",
    "MOBILE BASED TRACKER FOR PCOS",
    "PH CURRENCY DETECTOR FOR VISUALLY IMPAIRED",
    "MUSEO FERNANDINO",
    "ELEMENTRICKS",
    "JS-WIZARD",
    "CYBERSCAPE",
    "FITDROID",
    "ARTISANS CONNECT",
    "ARADA",
    "VIRUS HUNTER GAME",
  ],

  LMS: ["E-MODULE"],

  VotingSystem: ["Online Voting System for DHVTSU", "VATS"],

  DigitalGame: [
    "MATH-TINIK",
    "VIRUS HUNTER",
    "KULTURA PH",
    "LOG;C",
    "VACXINE",
    "KLASIKOPILIPINAS",
    "MATHINIK",
  ],

  ManagementSystem: [
    "EDUSCHEDULR",
    "Contact Tracer using temperature scanner",
    "Vehicle Management System",
    "MedTime",
    "Resident Record Management System",
    "Record Management System for GAD",
    "Serve",
    "Library Management System",
    "Rental Management System",
    "IRENT",
    "Library Management System with data analytics",
    "PASYUK",
  ],

  InventoryAndSalesSystem: ["BARACODE", "THERACURE"],

  InformationSystem: [
    "University Medical Clinic Appointment",
    "MEDICSCALE",
    "Assessing the Digital Maturity of Secondary Public School",
  ],

  MonitoringAndTrackingSystem: [
    "Alumni Portal Tracker",
    "Sensory Signal Scanner",
    "Fare Monitoring System",
    "Agricultural Crop Production Monitoring System",
  ],

  Arduino: ["AQUAFLOW", "PUGOPO", "Automatic Chicken Feeder"],

  Detector: ["Philippine Currency Detector"],

  Repository: ["Web-Based Repository for Student Profiling"],

  IdentificationSystem: ["MPID"],

  FarmingInformationSystem: ["I-PLANT: Backyard Farming Information System"],

  ChatBot: ["DHVSU MPC CHATBOT"],

  AugmentedReality: ["HoloAR"],
};

// methods
const thesisDataMETHOD = {
  Iterative: [
    "MSWD Online Financial Assistance",
    "ANTABE",
    "HTEFINDER",
    "COMPAWNION",
  ],
  Agile: [
    "Taskgrove",
    "Equipment maintenance monitoring",
    "CODEQUEST",
    "PALENGKIHAN",
  ],
};

// APPROACH
const thesisDataAPPROACH = {
  Quantitative: ["CODEQUEST", "Taskgrove", "HTEFinder"],
  MixedMethod: [
    "COMPAWNION",
    "Web-Based Equipment Maintenance Monitoring System for DHVSU Facilities",
  ],
};

// RELATED OR ABOUT
const thesisDataRELATED = {
  Animals: ["COMPAWNION"],
  Disability: ["ANTABE"],
  Nature: ["Taskgrove"],
  Geography: ["COMPAWNION", "HTEFINDER"],
};

// KEYWORDS for the chatbot to respond
const keywords = {
  APP: {
    website: "website",
    MobileApplication: "mobile application"
  },
};

// chatbot configuration
const Chatbot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const sendMessage = (message) => {
    if (message.trim() === "") {
      alert("Please type a message");
      return;
    }

    setChatHistory([...chatHistory, { sender: "You", text: message }]);
    chatbotResponse(message);
    setUserMessage("");
  };

  // add a typing effect
  const typingEffect = (message) => {
    return new Promise((resolve) => {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < message.length) {
          setChatHistory((prevHistory) => [
            ...prevHistory.slice(0, -1),
            {
              sender: "Chatbot",
              text:
                message.slice(0, currentIndex + 1) +
                (currentIndex === message.length - 1 ? "" : " _"),
            }, // Adds cursor effect
          ]);
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          resolve();
        }
      }, 100); // Adjust typing speed here
    });
  };

  const chatbotResponse = (userMessage) => {
    let chatbotMessage =
      "I'm not sure about that. Please try asking in a different way, such as:\n'Which are websites?'\nor\n'Which are not websites?'\nAlternatively, try asking with a unique title.";
    const lowerCaseMessage = userMessage.toLowerCase();

    // Check if the message is a greeting
    if (lowerCaseMessage.includes("hi") || lowerCaseMessage.includes("hello")) {
      chatbotMessage = "Hello! How can I assist you today?";
    }
    // Check if the message is a personal question
    else if (
      lowerCaseMessage.includes("what is your name") ||
      lowerCaseMessage.includes("who are you") ||
      lowerCaseMessage.includes("how are you")
    ) {
      chatbotMessage =
        "I'm a chatbot here to assist you with thesis information uploaded in the website. How can I help you today?";
    }

    // check if there is negation or the word not
    const isNegation = lowerCaseMessage.includes("not");
    // clear the not in the response of the chatbot
    const queryMessage = lowerCaseMessage.replace("not", "").trim();

    setLoading(true); // Start loading

    // Project descriptions mapped to project names
    const projectDescriptions = {
      htefinder:
        "HTEFinder is a web app for matching Host Training Establishments (HTEs) with students for on-the-job training.",
      palengkihan:
        "PALE-NGKIHAN connects farmers and buyers directly in rice trading, increasing farmer profits and offering fair prices.",
      codequest:
        "CodeQuest is a gamified learning platform blending Java programming instruction with engaging elements.",
      compawnion:
        "Compawnion improves stray pet welfare using geo-location for rescue and adoption management.",
      "Web-Based Equipment Maintenance Monitoring System for DHVSU Facilities":
        "A web-based system for managing and monitoring DHVSU equipment and maintenance.",
      ANTABE:
        "Antabe is a smart guide stick for the visually impaired, featuring sensors, GPS, and vibratory cues.",
      MSWD: "A web app for managing MSWD financial assistance programs in Sto. Tomas.",
      TASKGROVE:
        "TaskGrove is a project management platform for task organization.",
      MPID: "A computerized student gate access and attendance monitoring system.",
      HoloAR:
        "HoloAR provides a 3D AR learning tool for computer hardware education.",
      "I-PLANT":
        "A gardening platform for backyard farming guidance in San Fernando, Pampanga.",
      "Chicken Feeder":
        "An automated poultry feeding system controlled via browser.",
      CYBERESCAPE: "CyberEscape is a mobile game teaching networking concepts.",
      "DIGITAL MATURITY":
        "This study assesses the digital maturity of secondary public schools in Pampanga.",
      VATS: "VATS is an Android-based voting system for DHVTSU students.",
      KlasikoPinas:
        "A platform to revive traditional Filipino games and folklore.",
      FITDROID:
        "FitDroid offers a health app with workout and COVID-19 support features.",
      PASYUK: "Pasyuk digitalizes sports event management at DHVSU.",
      "ARTISANS CONNECT":
        "A mobile app enabling artisans to showcase and sell creations.",
      Assemble: "An online catalog for PC Square Computer Sales and Services.",
      "E-MODULE":
        "An e-learning module platform for students at San Nicolas Integrated School.",
      IRENT:
        "A digital house rental management system for landlords and tenants.",
      WIZARD: "JS-Wizard is an offline JavaScript learning app.",
      COMPAN: "A crowdfunding donation platform for Bacolor, Pampanga.",
      ELEMENTRICKS:
        "A chemistry learning app combining elements in the periodic table.",
      "MUSEO FERNANDINO":
        "A 3D virtual environment simulating the San Fernando Old Train Station museum.",
      MAMALAKAYA: "An HIV awareness campaign website.",
      PCOS: "A mobile lifestyle tracker for PCOS patients with tailored analytics.",
      "ONE PUHUNAN":
        "A web app to digitize One Puhunan's recording and management processes.",
      "DHVSU MPC CHAT BOT":
        "A chatbot providing 24/7 assistance for DHVSU MPC clients.",
      MYHEALTH: "A stress management app promoting positive coping strategies.",
      ISKRABOL: "A Kapampangan language learning app for students.",
      KIDDONITOR:
        "A mobile app that tracks children's locations using GPS technology embedded in a smartwatch, with geo-fencing notifications.",
      "LOG;C":
        "A gamified learning platform designed to ease the learning curve for C++ beginners.",
      VACXINE:
        "A game raising awareness about computer viruses for less tech-savvy users.",
      KULTURAPH:
        "A digital preservation effort for Filipino ethnolinguistic culture and traditions.",
      "MATH-TINIK":
        "A gamified e-learning app for teaching mathematics to young learners.",
      MEDICSCALE:
        "An electronic medical record system to streamline health workers' workflows.",
      TRAVI:
        "An IoT-based vehicle tracking app with real-time monitoring and trip history features.",
      HanAp:
        "An app to expedite reporting and tracking missing persons with real-time updates.",
      THERACURE:
        "A web-based inventory and forecasting system for better health assistance.",
      Serve: "A platform connecting homeowners and home service providers.",
      ACCREFILE:
        "A file management repository with data analytics for Don Honorio Ventura State University.",
      KDF: "A record management system for KDF Ambulatory patients.",
      ARAL: "A 3D virtual learning app for preschool education.",
      SSS: "A contactless body-temperature monitoring system for Dinalupihan Elementary School.",
      AGKAS: "A Kapampangan language learning app using gamified techniques.",
      HYDRAFEEL: "A water refilling app with smart inventory management.",
      LETURAN: "A phonics teaching app with mini-games for Tagalog learners.",
      BARACODE: "An app for viewing menus and pre-ordering at Café Honorio.",
      CROPTURE: "A web-based solution for detecting and classifying crops.",
      PUGOPO:
        "A poultry forecasting and inventory system with Arduino automation.",
      MedTime: "An app combining medication scheduling with health tips.",
      COURSEDIRECT:
        "A course recommendation system based on the RIASEC framework.",
      UnangLunas: "A geofencing-based health monitoring app for emergencies.",
      "A FUZZY LOGIC":
        "A mobile app for monitoring indoor plant environments using fuzzy logic.",
      "CARLOS FITNESS":
        "A mobile and web-based system for fitness center operations.",
      EDUSCHEDULR:
        "A scheduling system addressing manual scheduling issues for GNC.",
      CARE: "A system for calamity assistance and locating evacuation centers.",
      "HANDY HELPS":
        "A mobile app connecting users with household service providers.",
      HANDYMEN:
        "An app for finding skilled workers in Brgy. Malpitic, Pampanga.",
      "B-SMART": "A financial literacy app for budgeting and decision-making.",
      AQUAFLOW:
        "An Arduino-powered smart irrigation system for sustainable farming.",
    };

    // Check for specific query about the thesis provided
    for (const [key, description] of Object.entries(projectDescriptions)) {
      if (queryMessage.toLowerCase().includes(key.toLowerCase())) {
        chatbotMessage = description;
        setTimeout(() => {
          setLoading(false);
          setChatHistory((prevHistory) => [
            ...prevHistory,
            { sender: "Chatbot", text: chatbotMessage },
          ]);
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }, 2000);
        return;
      }
    }

    // Display clickable options if query matches certain topics
    if (queryMessage.includes("website") || queryMessage.includes("web application")) {
      chatbotMessage = (
        <div>
          "Here are some options for you to explore: "
          <button onClick={() => handleKeywordClick("Websites")}>Websites</button>
          <button onClick={() => handleKeywordClick("Mobile Applications")}>Mobile Applications</button>
        </div>
      );
    }

    // Determine the category based on the user's message
    if (queryMessage.includes(keywords.APP.website)) {
      chatbotMessage = isNegation
        ? "It seems you're not interested in Websites, how about checking the Mobile Application: " +
          thesisDataAPP.MobileApplication.join(", ")
        : "Here are the Websites: " + thesisDataAPP.Websites.join(", ");
    } else if (queryMessage.includes(keywords.APP.webApplication)) {
      chatbotMessage = isNegation
        ? "It seems you're not interested in Web Applications, how about checking the Mobile Applications: " +
          thesisDataAPP.MobileApplication.join(", ")
        : "Here are the Web Applications: " +
          thesisDataAPP.Websites.join(", ") +
          ", " +
          thesisDataAPP.MobileApplication.join(", ");
    } else if (queryMessage.includes(keywords.APP.LMS)) {
      chatbotMessage = isNegation
        ? "It seems you're not interested in LMS, how about checking the Management Systems: " +
          thesisDataAPP.ManagementSystem.join(", ")
        : "Here is the LMS: " + thesisDataAPP.LMS.join(", ");
    } else if (queryMessage.includes(keywords.APP.ManagementSystem)) {
      chatbotMessage = isNegation
        ? "It seems you're not interested in Management Systems, how about checking the Mobile Applications: " +
          thesisDataAPP.MobileApplication.join(", ")
        : "Here are the Management Systems: " + thesisDataAPP.ManagementSystem.join(", ");
    }
    setTimeout(() => {
      setLoading(false);
      setChatHistory((prevHistory) => [
        ...prevHistory,
        { sender: "Chatbot", text: chatbotMessage },
      ]);
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }, 2000);
  };


  // clickable key words
  const handleKeywordClick = (keyword) => {
    setUserMessage(keyword);
    sendMessage(keyword);
  };

  // structure
  return (
    <div>
      <div
        id="chatContainer"
        style={{
          maxHeight: "400px",
          overflowY: "auto",

          padding: "10px",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
        ref={chatContainerRef}
      >
        <img src="/chatbotlogo3.png" alt="Logo" className="chatbotlogo" />
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            style={{
              textAlign: chat.sender === "You" ? "right" : "left",
              margin: "10px",
            }}
          >
            <span>{chat.sender}: </span>
            <span>{chat.text}</span>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: "left", margin: "10px" }}>
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        )}
      </div>

      <div>
        {/* Render clickable keywords */}

      </div>

      <div className="chatbot-input">
        <input
          id="text-box"
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage(userMessage)}
          style={{
            margin: "5px",
            padding: "19px",
            flex: "1",
            borderRadius: "3px",
          }}
        />
        <button
          id="sendBtn"
          onClick={() => sendMessage(userMessage)}
          style={{ margin: "5px", padding: "20px", backgroundColor: "#38b6ff" }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
