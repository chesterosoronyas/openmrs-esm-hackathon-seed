import { setPriority } from "os";
import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import dayjs from "dayjs";
import { objectTypeSpreadProperty } from "@babel/types";
import { render } from "@testing-library/react";
import { format } from "util";

export default function DiagnosisInfoParcel(props: DiagnosisInfoParcelProps) {
  const [Diagnosislist, setDiagnosislist] = React.useState(null);
  React.useEffect(() => {
    const queryParams = `custom:(uuid,display,value:(uuid,display,conceptClass:(uuid,display,name)),obsDatetime)`.replace(
      /\s/g,
      ""
    );
    fetch(
      `/openmrs/ws/rest/v1/obs?concept=1284AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA&patient=${props.patientUuid}&v=${queryParams}`
    )
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw Error(
            `Cannot fetch patient diagnosis details for ${props.patientUuid} - server responded with '${resp.status} `
          );
        }
      })
      .then(Diagnosislist => {
        setDiagnosislist(Diagnosislist.results);
      });
  }, []);
  //   }

  //getDiagnosis();

  return Diagnosislist ? renderDiagnosis() : renderLoader();
  function renderDiagnosis() {
    let arraylist: any[] = [];
    let arrayreturned: any[] = [];
    let date: string;
    let previousdate: number;

    if (Diagnosislist.length > 0) {
      arraylist = Diagnosislist.map(x => {
        if (x.value.conceptClass.display == "Diagnosis") {
          return {
            value: x.value.display,
            conceptclass: x.value.conceptClass.display,
            Date: dayjs(x.obsDatetime).format("YYYY-MM-DD")
          };
        }
      });

      arraylist.sort(
        (a, b) => new Date(b["Date"]).getTime() - new Date(a["Date"]).getTime()
      );

      let item = arraylist[0];

      // date = arraylist[0]['Date']
      if (item.Date) {
        date = item.Date;
      }

      let datetime = new Date();
      previousdate = datetime.setMonth(datetime.getMonth() - 12);

      arrayreturned = arraylist.filter(
        x =>
          dayjs(x["Date"]).format("YYYY-MM-DD") >=
          dayjs(new Date(previousdate).getTime()).format("YYYY-MM-DD")
      );
      if (arrayreturned.length > 0) {
        return (
          <div>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Diagnosis</h5>
              </div>
              <div className="card-body">
                <ul className="list-group">
                  {arrayreturned.map(x => {
                    return <li className="list-group-item">{x.value}</li>;
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Diagnosis</h5>
              </div>
              <div className="card-body">
                <p>No Diagnosis</p>
              </div>
            </div>
          </div>
        );
      }
    } else {
      renderNoDiagnosis();
    }
  }

  function renderLoader() {
    return <div>Loading ...</div>;
  }
  function renderNoDiagnosis() {
    return (
      <div>
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Diagnosis</h5>
            <div className="card-body">
              <p>No Diagnosis</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

type DiagnosisInfoParcelProps = {
  patientUuid: string;
};
