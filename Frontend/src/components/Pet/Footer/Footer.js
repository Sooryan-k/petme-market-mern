import React from "react";
import { MDBFooter, MDBContainer, MDBIcon, MDBBtn } from "mdb-react-ui-kit";

export default function Footer() {
  const footerStyle = {
    backgroundColor: "#1B263B",
    color: "#FFF",
    width: "100%",
    position: "relative",
    marginTop: "auto",
  };

  return (
    <MDBFooter style={footerStyle} className="text-center text-white">
      <MDBContainer className="p-4 pb-0">
        <section className="mb-4">
          <MDBBtn
            floating
            className="m-1"
            style={{ backgroundColor: "#3b5998", border: "none" }}
            href="/"
            role="button"
          >
            <MDBIcon fab icon="facebook-f" />
          </MDBBtn>
          <MDBBtn
            floating
            className="m-1"
            style={{ backgroundColor: "#55acee", border: "none" }}
            href="/"
            role="button"
          >
            <MDBIcon fab icon="twitter" />
          </MDBBtn>
          <MDBBtn
            floating
            className="m-1"
            style={{ backgroundColor: "#dd4b39", border: "none" }}
            href="/"
            role="button"
          >
            <MDBIcon fab icon="google" />
          </MDBBtn>
          <MDBBtn
            floating
            className="m-1"
            style={{ backgroundColor: "#ac2bac", border: "none" }}
            href="/"
            role="button"
          >
            <MDBIcon fab icon="instagram" />
          </MDBBtn>
          <MDBBtn
            floating
            className="m-1"
            style={{ backgroundColor: "#0082ca", border: "none" }}
            href="/"
            role="button"
          >
            <MDBIcon fab icon="linkedin-in" />
          </MDBBtn>
        </section>
      </MDBContainer>
      <div className="text-center p-3" style={{ backgroundColor: "#131A22" }}>
        © 2024 Copyright :
        <a className="text-white text-decoration-none" href="/">
          PETme.com
        </a>
      </div>
    </MDBFooter>
  );
}
