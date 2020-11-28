import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  Fragment,
} from "react";
import MailContext from '../context/MailContext/mailContext'

const DirectMailItem = (props) => {
  const mailContext = useContext(MailContext);

  const { mailItem, entry } = props;

  const { viewMailItem, setDirectMailItem,deleteScheduleItem } = mailContext;

  const onClick = (e) => {
    viewMailItem(mailItem.title);
    setDirectMailItem(mailItem);
  };

  const onClick2 = e =>{
    deleteScheduleItem(entry._id)
  }

  return (
    <a
      onClick={mailItem ? onClick : () => viewMailItem(entry.mailItem)}
      className='bg-primary all-center m-1'
      style={{ height: "175px", width: "175px", display: "block" }}>
      {entry && <button onClick={onClick2}>X</button>}
      {mailItem && mailItem.title} {mailItem && <br />}
      {mailItem && mailItem.tracking}
      {mailItem && <br />}
      {mailItem &&
        Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }).format(new Date(mailItem.startDate))}{" "}
      {mailItem && <br />}
      {entry && entry.title} <br />
      {entry && entry.tracking} <br />
      {entry &&
        Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }).format(new Date(entry.startDate))}{" "}
      <br />
    </a>
  );
};

export default DirectMailItem;
