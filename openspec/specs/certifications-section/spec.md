# certifications-section Specification

## Purpose

The Certifications section gives homepage visitors a compact, card-based view of the developer's professional certifications, sourced strictly from the reference resume document, separate from the academic background already told by Education and the technology list already told by Skills.

## Requirements

### Requirement: Certification Card Display
The Certifications section SHALL display each certification present in the reference resume document as an individual card, showing at least the certification's name.

#### Scenario: Visitor views the Certifications section
- **WHEN** a visitor loads the Certifications section
- **THEN** every certification from the reference resume is displayed as an individual card showing that certification's name

### Requirement: No Fabricated Certification Metadata
The Certifications section SHALL NOT display an issuing organization, issue date, expiration date, credential ID, or verification link for a certification unless that specific piece of information is present in the reference resume document for that certification.

#### Scenario: Certification has no issuer, dates, credential ID, or link in the resume
- **WHEN** a visitor views a certification card for which the reference resume provides no issuer, dates, credential ID, or verification link
- **THEN** the card displays the certification's name without a placeholder, guessed value, or empty field for the missing information

### Requirement: Verification Link Access
The Certifications section SHALL provide a way for a visitor to open a certification's verification link when the reference resume document provides one for that certification.

#### Scenario: Certification has a verification link in the resume
- **WHEN** a visitor views a certification card for which the reference resume provides a verification link
- **THEN** the visitor can open that link to reach the credential's official verification page

### Requirement: Certification Scope Only
The Certifications section SHALL display only professional certifications and SHALL NOT display academic degrees, which remain exclusive to the Education section.

#### Scenario: Visitor views the Certifications section content
- **WHEN** a visitor loads the Certifications section
- **THEN** no academic degree from the reference resume appears among the displayed entries

### Requirement: Responsive Certifications Layout
The Certifications section SHALL render a usable, readable layout across mobile, tablet, and desktop viewport widths without horizontal overflow.

#### Scenario: Visitor on a mobile viewport
- **WHEN** a visitor loads the homepage on a mobile-width viewport
- **THEN** certification cards stack or wrap into the available width and remain readable without horizontal scrolling or overlapping elements

#### Scenario: Visitor on a desktop viewport
- **WHEN** a visitor loads the homepage on a desktop-width viewport
- **THEN** certification cards make use of the available width without appearing sparse or misaligned
