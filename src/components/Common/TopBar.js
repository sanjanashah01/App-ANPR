import React from "react";

import logosm from "../../assets/images/logo-dark.png";
import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-dark.png";

// import component
import ProfileMenu from "./TopbarDropdown/ProfileMenu";

const TopBar = () => {
  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <div className="navbar-brand-box text-center">
              <a href="#" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logosm} alt="logo-sm-dark" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logodark} alt="logo-dark" height="48" />
                </span>
              </a>

              <a href="#" className="logo logo-light">
                <span className="logo-sm">
                  <img src={logosm} alt="logo-sm-light" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logolight} alt="logo-light" height="48" />
                </span>
              </a>
            </div>

            <button
              type="button"
              className="btn btn-sm px-3 font-size-24 header-item waves-effect"
              id="vertical-menu-btn"
            >
              <i className="ri-menu-2-line align-middle"></i>
            </button>
          </div>

          <div className="d-flex">
            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                className="btn header-item noti-icon waves-effect"
                data-toggle="fullscreen"
              >
                <i className="ri-fullscreen-line"></i>
              </button>
            </div>
            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

export default TopBar;
