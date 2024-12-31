import "./styles/formResponseTable.css";
import date from "../assets/svgs/date.svg";

const FormResponseTable = ({ form }) => {

    const formatDate = (dateString) => {
        const options = {
          month: "short", // Abbreviated month name
          day: "numeric", // Numeric day
          hour: "numeric", // Hour in 12-hour format
          minute: "numeric", // Minutes
          hour12: true, // Use 12-hour format
        };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", options).format(date);
      };

  return (
    <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Sr. No.</th>
          <th>
            <img src={date} alt="date" />
            Submitted At
          </th>
          {form.data.map((label) => {
            if (label.type === "buttons") return null;
            return <th key={label.id}>{label.label}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {form.responses.map((response, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{formatDate(response.submittedAt)}</td>
            {form.data.map((label) => {
              const matchingResponse = response.response.find(
                (res) => res.id === label.id
              );
              if (label.type === "buttons") return null;
              return (
                <td key={label.id}>
                  {matchingResponse ? matchingResponse.value : "N/A"}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default FormResponseTable;
