import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import {
  changeLayout,
  changeLayoutMode,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  showRightSidebarAction,
} from "../../store/actions";

//SimpleBar
import SimpleBar from "simplebar-react";

import "./rightbar.scss";

//constants
import { layoutModeTypes } from "../../constants/layout";

const RightSidebar = (props) => {
  return (
    <React.Fragment>
      <div className="right-bar" id="right-bar">
        <SimpleBar style={{ height: "900px" }}>
          <div data-simplebar className="h-100">
            <div className="rightbar-title px-3 py-4">
              <div className="p-4">
                <h5>Theme</h5>
                <hr className="mt-1" />
                {/* Layout Mode */}
                <div className="radio-toolbar">
                  <input
                    type="radio"
                    id="radioLightmode"
                    name="radioMode"
                    value={layoutModeTypes.LIGHTMODE}
                    checked={
                      props.layoutModeTypes === layoutModeTypes.LIGHTMODE
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        props.changeLayoutMode(e.target.value);
                      }
                    }}
                  />
                  <label className="me-1" htmlFor="radioLightmode">
                    Light
                  </label>

                  <input
                    type="radio"
                    id="radioDarkMode"
                    name="radioMode"
                    value={layoutModeTypes.DARKMODE}
                    checked={props.layoutModeTypes === layoutModeTypes.DARKMODE}
                    onChange={(e) => {
                      if (e.target.checked) {
                        props.changeLayoutMode(e.target.value);
                      }
                    }}
                  />
                  <label htmlFor="radioDarkMode">Dark</label>
                </div>
              </div>
            </div>
          </div>
        </SimpleBar>
      </div>
      <div className="rightbar-overlay"></div>
    </React.Fragment>
  );
};

RightSidebar.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutMode: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  layoutType: PropTypes.any,
  layoutModeTypes: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  topbarTheme: PropTypes.any,
  onClose: PropTypes.func,
};

const mapStateToProps = (state) => {
  return { ...state.Layout };
};

export default connect(mapStateToProps, {
  changeLayout,
  changeLayoutMode,
  changeSidebarTheme,
  changeSidebarType,
  changeLayoutWidth,
  changeTopbarTheme,
  showRightSidebarAction,
})(RightSidebar);
