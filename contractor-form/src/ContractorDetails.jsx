import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { Gavel, UserRound, Mail, Package, Paperclip, FileText, Download } from "lucide-react";

function ContractorDetails() {
  return (
    <Container fluid className="p-4 bg-light">
      <Row className="g-4 align-items-stretch">

        <Col lg={9}>
          <Card className="border rounded-3 h-100" style={{ borderColor: "#0051973D" }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex align-items-center gap-3">
                  <div className="text-primary">
                    <Gavel size={28} />
                  </div>
                  <h5 className="mb-0 fw-bold" style={{ fontSize: '1.25rem' }}>
                    Tender Floated Details – Green Heights
                  </h5>
                </div>

                <div className="d-flex gap-5 text-end">
                  <div>
                    <div className="text-muted small mb-1" style={{ fontSize: '0.8rem' }}>Floating No</div>
                    <div className="fw-bold text-dark">TF – 2025 – 001</div>
                  </div>
                  <div>
                    <div className="text-muted small mb-1" style={{ fontSize: '0.8rem' }}>Floating Date</div>
                    <div className="text-muted fw-normal" style={{ fontSize: '0.95rem' }}>November 20, 2025</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Badge
                  bg="none"
                  className="rounded-pill px-3 py-2 fw-normal"
                  style={{ 
                    backgroundColor: '#F3F8FF', 
                    color: '#2563EB',
                    fontSize: '0.9rem' 
                  }}
                >
                  Tender Name : Urban Sky Residential Hub
                </Badge>
              </div>

              <Row className="g-3">
                <Col md={4}>
                  <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#F8FAFC' }}>
                    <div className="text-muted mb-3" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                      Offer Submission Mode
                    </div>
                    <div className="fw-bold text-dark fs-5">Online</div>
                  </div>
                </Col>

                <Col md={4}>
                  <div className="p-4 rounded-4 h-100" style={{ backgroundColor: '#F8FAFC' }}>
                    <div className="text-muted mb-3" style={{ fontSize: '0.9rem', fontWeight: '500' }}>
                      Bid Opening
                    </div>
                    <div className="fw-bold text-dark fs-5">
                      December 01, 2025
                    </div>
                  </div>
                </Col>

                <Col md={4}>
                  <div
                    className="p-4 rounded-4 h-100 position-relative"
                    style={{
                      backgroundColor: "#FEF2F2",
                      borderLeft: "4px solid #DC2626", 
                    }}
                  >
                    <div className="text-danger mb-3" style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                      Submission Last Date
                    </div>
                    <div className="fw-bold fs-5" style={{ color: '#D90707' }}>
                      November 30, 2025
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={3}>
          <Card
            className="border rounded-3 h-100 text-white"
            style={{ background: "linear-gradient(135deg, #005197, #007BFF)", borderColor: "#0051973D" }}
          >
            <Card.Body className="p-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <UserRound size={20} style={{ color: '#FFD700' }} />
                <h5 className="mb-0 fw-normal">Contact Person</h5>
              </div>

              <div className="mb-3">
                <div className="opacity-75" style={{ fontSize: '0.85rem' }}>Name</div>
                <div className="fw-normal">Sarah Mitchell</div>
              </div>

              <div className="mb-3">
                <div className="opacity-75" style={{ fontSize: '0.85rem' }}>Phone</div>
                <div className="fw-normal">+1 (555) 123-4567</div>
              </div>

              <div>
                <div className="opacity-75 mb-2" style={{ fontSize: '0.85rem' }}>Email</div>
                
                <Badge
                  bg="white"
                  className="rounded-pill px-3 py-2 d-flex align-items-center border-0"
                  style={{ width: 'fit-content' }}
                >
                  <Mail size={16} className="me-2" style={{ color: '#2563EB' }} />
                  <span 
                    className="fw-normal" 
                    style={{ color: '#2563EB', fontSize: '0.8rem' }}
                  >
                    sarah.mitchell@greenheights.com
                  </span>
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      <Card className=" mt-4 border rounded-3 h-100" style={{ borderColor: "#0051973D" }}>
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <Package size={20} className="text-primary" />
            <h5 className="mb-0 fw-bold text-dark">
              Scope of Work & Scope of Packages
            </h5>
          </div>
          <p className="mb-4" style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Complete construction of 5-story commercial complex including foundation, structure, MEP systems, and finishing works...
          </p>
          <div className="d-flex flex-wrap gap-3">
            {['Civil Works', 'Electrical Systems', 'Safety Equipment', 'HVAC Installation'].map((text) => (
              <Badge 
                key={text}
                pill 
                bg="none" 
                className="px-3 py-2 fw-normal"
                style={{ 
                  backgroundColor: '#EBF2FF', 
                  color: '#3B82F6',
                  fontSize: '0.85rem'
                }}
              >
                {text}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card className="border rounded-3 mt-4 h-100" style={{ borderColor: "#0051973D" }}>
        <Card.Body className="p-4">
          <div className="d-flex align-items-center gap-2 mb-4">
            <Paperclip size={20} className="text-primary" style={{ transform: 'rotate(15deg)' }} />
            <h5 className="mb-0 fw-bold text-dark">Attachments</h5>
          </div>
          <div 
            className="d-flex justify-content-between align-items-center p-4 rounded-4" 
            style={{ backgroundColor: '#F8FAFC' }}
          >
            <div className="d-flex gap-3">
              <FileText size={32} className="text-danger" />
              <div>
                <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                  Technical Specifications
                </div>
                <div className="text-muted small mb-1">
                  pdf • 4.2 MB
                </div>
                <div className="text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                  Detailed technical requirements for all construction phases including material specifications and quality standards.
                </div>
              </div>
            </div>
            
            <div className="ps-3">
              <Download size={24} className="text-primary" style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </Card.Body>
      </Card>

    </Container>
  );
}

export default ContractorDetails;