import { useState } from "react";
import CreateIdenticon from "./CreateIdenticon";
const NewExperience = ({ state }) => {
 

  return (
    <form onSubmit={() => {}}>
      <div className="col-md-12">
        <div className="card card-container login-form">
          <h1>Add New Tasting</h1>
          <div className="form-group">
            <label className="cameraButton">
              <i className="fas fa-camera-retro"></i> Take a picture
                <CreateIdenticon />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Are you sharing this bottle with other people? How many?
            </label>
            <textarea
              type="text"
              className="form-control"
              name="answer1"
              value={state?.answer1}
              style={{ resize: "none" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Did you buy this bottle with crypto? or in a shop or restaurant?
              was it a gift?
            </label>
            <textarea
              type="text"
              className="form-control"
              name="answer2"
              style={{ resize: "none" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Are you drinking this wine with food? What are you eating
            </label>
            <textarea
              type="text"
              className="form-control"
              name="answer3"
              style={{ resize: "none" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Do you like this wine? How would you rank it?
            </label>
            <textarea
              type="text"
              className="form-control"
              name="answer4"
              style={{ resize: "none" }}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Do you think we should build a colony on Mars?
            </label>
            <textarea
              type="text"
              className="form-control"
              name="answer5"
              style={{ resize: "none" }}
            />
          </div>
          <div className="form-group">
            <div className="form-group"></div>
            <button className="btn btn-primary btn-block">
       
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default NewExperience;
