import FormResponseTable from "../components/FormResponseTable";
import PreLoader from "../components/PreLoader";
import { PieChart } from "react-minimal-pie-chart";
import "./styles/formResponse.css";

const FormResponse = ({ form, loading }) => {
  const canShow = form?.viewed === 0;
  const viewed = form?.viewed || 0;
  const completed = form?.responses.length || 0;
  const started =
    form?.started == 0 && completed != 0 ? completed : form?.started;

  return (
    <div className="formresponse__container">
      {loading && <PreLoader />}

      {canShow ? (
        <span className="formresponse__noresponse">No Responses Yet</span>
      ) : (
        <div className="formresponse__response">
          {/* Top Statistics Section */}
          <div className="formresponse__response_top">
            <div className="stat">
              <span>Views</span>
              <p>{viewed}</p>
            </div>
            <div className="stat">
              <span>Started</span>
              <p>{started}</p>
            </div>
          </div>

          {/* Responses Table Section */}
          <section className="formresponse__table">
            {form && <FormResponseTable form={form} />}
          </section>

          {form && form.responses.length > 0 && (
            <div className="formresponse__chart">
              {/* Pie Chart Section */}
              <span className="formresponse__pie">
                <PieChart
                  data={[
                    {
                      title: "",
                      value: started - completed,
                      color: "#909090",
                    },
                    { title: "Completed", value: completed, color: "#3B82F6" },
                  ]}
                  lineWidth={20}
                  animate
                  label={({ dataEntry }) =>
                    dataEntry.title
                      ? `${dataEntry.title}: ${dataEntry.value}`
                      : ""
                  }
                  labelStyle={{
                    fontSize: "3px",
                    fontWeight: "bold",
                    fill: "var(--hover-color)",
                  }}
                />
              </span>

              <span className=" formresponse__completion">
                Completion Rate:{" "}
                <span>{Math.floor((completed / started) * 100)}%</span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormResponse;
