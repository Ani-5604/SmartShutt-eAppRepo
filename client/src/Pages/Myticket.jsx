import React, { useState, useEffect, useCallback } from "react";
import { jsPDF } from "jspdf";
import Cookies from "js-cookie";
import axios from "axios";
import { logoutAPI } from "../Redux/authentication/auth.action";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { error, success } from "../Utils/notification";
import { BiArrowFromLeft } from "react-icons/bi";
import { useLanguage } from "../Components/context/LanguageContext"; // Import language context
import styles from "../Styles/myticket.module.css";

function Myticket() {
  const { language } = useLanguage(); // Get current language from context

  // Define translations
  const translations = {
    English: {
      todaysTickets: "Today's Tickets",
      upcomingTickets: "Upcoming Tickets",
      pastTickets: "Past Tickets",
      cancelTicket: "Cancel Ticket",
      removeTicket: "Remove Ticket",
      downloadTicket: "Download Ticket",
      confirmCancel: "Are you sure you want to cancel this ticket?",
      cancelSuccess: "Ticket Cancelled Successfully",
      removeSuccess: "Ticket Removed Successfully",
      sessionError: "Session Expired. Please Sign In Again.",
      cancelAbort: "Ticket cancellation was aborted.",
      note: "IMP NOTE: You Can Cancel Ticket One Day Before Journey"
    },
    हिंदी: {
      todaysTickets: "आज की टिकटें",
      upcomingTickets: "आगामी टिकटें",
      pastTickets: "पिछली टिकटें",
      cancelTicket: "टिकट रद्द करें",
      removeTicket: "टिकट हटाएं",
      downloadTicket: "टिकट डाउनलोड करें",
      confirmCancel: "क्या आप इस टिकट को रद्द करना चाहते हैं?",
      cancelSuccess: "टिकट सफलतापूर्वक रद्द कर दिया गया",
      removeSuccess: "टिकट सफलतापूर्वक हटा दिया गया",
      sessionError: "सत्र समाप्त हो गया। कृपया फिर से साइन इन करें।",
      cancelAbort: "टिकट रद्दीकरण को रद्द कर दिया गया।",
      note: "महत्वपूर्ण नोट: आप यात्रा से एक दिन पहले टिकट रद्द कर सकते हैं।"
    },
    বাংলা: {
      todaysTickets: "আজকের টিকিট",
      upcomingTickets: "আগামী টিকিট",
      pastTickets: "পূর্ববর্তী টিকিট",
      cancelTicket: "টিকিট বাতিল করুন",
      removeTicket: "টিকিট সরান",
      downloadTicket: "টিকিট ডাউনলোড করুন",
      confirmCancel: "আপনি কি এই টিকিট বাতিল করতে চান?",
      cancelSuccess: "টিকিট সফলভাবে বাতিল করা হয়েছে",
      removeSuccess: "টিকিট সফলভাবে সরানো হয়েছে",
      sessionError: "সেশন মেয়াদ উত্তীর্ণ। আবার সাইন ইন করুন।",
      cancelAbort: "টিকিট বাতিল করা হয়নি।",
      note: "গুরুত্বপূর্ণ টিপ: আপনি যাত্রার একদিন আগে টিকিট বাতিল করতে পারেন।"
    },
    اردو: {
      todaysTickets: "آج کے ٹکٹ",
      upcomingTickets: "آنے والے ٹکٹ",
      pastTickets: "ماضی کے ٹکٹ",
      cancelTicket: "ٹکٹ منسوخ کریں",
      removeTicket: "ٹکٹ ہٹائیں",
      downloadTicket: "ٹکٹ ڈاؤن لوڈ کریں",
      confirmCancel: "کیا آپ اس ٹکٹ کو منسوخ کرنا چاہتے ہیں؟",
      cancelSuccess: "ٹکٹ کامیابی سے منسوخ ہوگیا",
      removeSuccess: "ٹکٹ کامیابی سے ہٹا دیا گیا",
      sessionError: "سیشن ختم ہوگیا۔ براہ کرم دوبارہ سائن ان کریں۔",
      cancelAbort: "ٹکٹ منسوخی منسوخ کردی گئی۔",
      note: "اہم نوٹ: آپ سفر سے ایک دن پہلے ٹکٹ منسوخ کر سکتے ہیں۔"
    },
    मराठी: {
      todaysTickets: "आजचे तिकीटे",
      upcomingTickets: "आगामी तिकीटे",
      pastTickets: "मागील तिकीटे",
      cancelTicket: "तिकीट रद्द करा",
      removeTicket: "तिकीट काढा",
      downloadTicket: "तिकीट डाउनलोड करा",
      confirmCancel: "तुम्हाला हे तिकीट रद्द करायचे आहे का?",
      cancelSuccess: "तिकीट यशस्वीरित्या रद्द केली",
      removeSuccess: "तिकीट यशस्वीरित्या काढले",
      sessionError: "सत्र कालबाह्य झाले आहे. कृपया पुन्हा साइन इन करा.",
      cancelAbort: "तिकीट रद्द करणे रद्द केले गेले.",
      note: "महत्वाची सूचना: आपण प्रवासाच्या एका दिवसाआधी तिकीट रद्द करू शकता."
    },
    العربية: {
      todaysTickets: "تذاكر اليوم",
      upcomingTickets: "التذاكر القادمة",
      pastTickets: "التذاكر السابقة",
      cancelTicket: "إلغاء التذكرة",
      removeTicket: "إزالة التذكرة",
      downloadTicket: "تحميل التذكرة",
      confirmCancel: "هل أنت متأكد أنك تريد إلغاء هذه التذكرة؟",
      cancelSuccess: "تم إلغاء التذكرة بنجاح",
      removeSuccess: "تم إزالة التذكرة بنجاح",
      sessionError: "انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.",
      cancelAbort: "تم إلغاء إلغاء التذكرة.",
      note: "ملاحظة هامة: يمكنك إلغاء التذكرة قبل يوم واحد من الرحلة."
    }
  };

  const [ticketsData, setTicketsData] = useState({
    allTickets: [],
    today: [],
    upcoming: [],
    past: []
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const userid = Cookies.get("userid");
    if (!userid) {
      navigate("/");
      return;
    }
    fetchTicketsData(userid);
    success(translations[language].note);  // Display the note in the selected language
  }, [language]);

  const fetchTicketsData = useCallback(async (userId) => {
    setLoading(true);
    try {
      const [allTicketsRes, todayRes, upcomingRes, pastRes] = await Promise.all([
        axios.post("http://localhost:8070/order/myticket", { id: userId }),
        axios.post("http://localhost:8070/order/myticket/today", { id: userId }),
        axios.post("http://localhost:8070/order/myticket/upcoming", { id: userId }),
        axios.post("http://localhost:8070/order/myticket/past", { id: userId })
      ]);

      setTicketsData({
        allTickets: allTicketsRes.data,
        today: todayRes.data,
        upcoming: upcomingRes.data,
        past: pastRes.data
      });
    } catch (error) {
      handleSessionError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSessionError = (error) => {
    console.log(error);
    error(translations[language].sessionError);
    dispatch(logoutAPI());
    navigate("/");
    Cookies.remove("jwttoken");
    Cookies.remove("userid");
    Cookies.remove("usergender");
  };

  const handleCancelTicket = (ticketId) => {
    const confirmCancel = window.confirm(translations[language].confirmCancel);
    if (confirmCancel) {
      setTicketsData((prevData) => ({
        ...prevData,
        today: prevData.today.map((ticket) =>
          ticket.ticketSummary.id === ticketId
            ? { ...ticket, canceled: true }
            : ticket
        ),
        upcoming: prevData.upcoming.map((ticket) =>
          ticket.ticketSummary.id === ticketId
            ? { ...ticket, canceled: true }
            : ticket
        )
      }));
      success(translations[language].cancelSuccess);
    } else {
      error(translations[language].cancelAbort);
    }
  };

  const handleRemoveTicket = (ticketId) => {
    setTicketsData((prevData) => ({
      ...prevData,
      today: prevData.today.filter((ticket) => ticket.ticketSummary.id !== ticketId),
      upcoming: prevData.upcoming.filter((ticket) => ticket.ticketSummary.id !== ticketId)
    }));
    success(translations[language].removeSuccess);
  };

  const handleDownload = (ticket) => {
    const { ticketSummary, busDetails } = ticket;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(translations[language].downloadTicket, 105, 20, null, null, "center");

    doc.setLineWidth(0.5);
    doc.rect(10, 30, 190, 270);

    doc.setFillColor(33, 150, 243);
    doc.rect(10, 30, 190, 20, "F");

    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text(busDetails.name, 105, 40, null, null, "center");

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Ticket ID: ${ticketSummary.id}`, 15, 60);
    doc.text(`Payment ID: ${ticketSummary.paymentId}`, 15, 75);
    doc.text(`From: ${busDetails.from}`, 15, 90);
    doc.text(`To: ${busDetails.to}`, 15, 105);
    doc.text(`Departure: ${busDetails.departure}`, 15, 120);
    doc.text(`Arrival: ${busDetails.arrival}`, 15, 135);
    doc.text(`Seat No: ${ticketSummary.ticket}`, 15, 150);
    doc.text(`Amount: INR ${ticketSummary.amount}`, 15, 165);
    doc.text(`Date of Journey: ${ticketSummary.date.split("T")[0]}`, 15, 180);

    doc.setFillColor(240, 240, 240);
    doc.rect(10, 185, 190, 30, "F");
    doc.setFontSize(16);
    doc.setTextColor(33, 150, 243);
    doc.text(translations[language].fareDetails, 15, 200);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(translations[language].thankYou, 105, 260, null, null, "center");

    doc.save(`Ticket_${ticketSummary.id}.pdf`);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <nav>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              <button
                className="nav-link active"
                id="nav-home-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-home"
                type="button"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                onClick={() => fetchTicketsData(Cookies.get("userid"))}
              >
                {translations[language].todaysTickets}
              </button>
              <button
                className="nav-link"
                id="nav-profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-profile"
                type="button"
                role="tab"
                aria-controls="nav-profile"
                aria-selected="false"
              >
                {translations[language].upcomingTickets}
              </button>
              <button
                className="nav-link"
                id="nav-contact-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-contact"
                type="button"
                role="tab"
                aria-controls="nav-contact"
                aria-selected="false"
              >
                {translations[language].pastTickets}
              </button>
            </div>
          </nav>

          <div className="tab-content" id="nav-tabContent">
            <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
              <TicketList
                tickets={ticketsData.today}
                handleCancel={handleCancelTicket}
                handleRemove={handleRemoveTicket}
                handleDownload={handleDownload}
                translations={translations}
                language={language}
              />
            </div>
            <div className="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
              <TicketList
                tickets={ticketsData.upcoming}
                handleCancel={handleCancelTicket}
                handleRemove={handleRemoveTicket}
                handleDownload={handleDownload}
                translations={translations}
                language={language}
              />
            </div>
            <div className="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
              <TicketList
                tickets={ticketsData.past}
                handleCancel={handleCancelTicket}
                handleRemove={handleRemoveTicket}
                handleDownload={handleDownload}
                translations={translations}
                language={language}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Child component
function TicketList({ tickets, handleCancel, handleRemove, handleDownload, translations, language }) {
  return (
    <div className={styles.busdata}>
      {tickets?.map((ticket) => {
        const isCanceled = ticket.canceled;
        return (
          <div
            key={ticket.ticketSummary.id}
            className={`${styles.ticketContainer} ${isCanceled ? styles.canceled : ""}`}
          >
            <h5>{ticket?.busDetails.name.charAt(0).toUpperCase() + ticket?.busDetails.name.slice(1)} Travels</h5>
            <div>
              <p>{ticket?.busDetails.from}</p>
              <p><BiArrowFromLeft /></p>
              <p>{ticket?.busDetails.to}</p>
            </div>
            <hr />
            <h6>Arrival Time: {ticket.busDetails.arrival}</h6>
            <h6>Departure Time: {ticket.busDetails.departure}</h6>
            <hr />
            <h6>Email: {ticket?.busDetails.contactemail}</h6>
            <h6>Phone: {ticket?.busDetails.contactphone}</h6>
            <hr />
            <h6>Date of Journey: {ticket?.ticketSummary.date.split("T")[0]}</h6>
            <hr />
            <div>
              {!isCanceled && (
                <>
                  <button
                    className={styles.btn}
                    onClick={() => handleCancel(ticket.ticketSummary.id)}
                  >
                    {translations[language].cancelTicket}
                  </button>
                  <button
                    className={styles.downloadBtn}
                    onClick={() => handleDownload(ticket)}
                  >
                    {translations[language].downloadTicket}
                  </button>
                </>
              )}
              {isCanceled && (
                <>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemove(ticket.ticketSummary.id)}
                  >
                    {translations[language].removeTicket}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Myticket;
