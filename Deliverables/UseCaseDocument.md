# Fractoo - Online Doctor Appointment Booking Platform
## Use Case Document

### 1. User Stories (Patient)

**1.1 User Authentication**
- **Actor:** Patient
- **Description:** As a user, I should be able to log in, log out, and register into the application securely.
- **Pre-Conditions:** User must provide valid email and password format.
- **Post-Conditions:** System creates an account and logs the user in via JWT token.

**1.2 City Selection & Doctor Search**
- **Actor:** Patient
- **Description:** As a user, I should be able to select a city, desired appointment date, and a specific medical specialization to search for available doctors. 

**1.3 View Available Doctors**
- **Actor:** Patient
- **Description:** As a user, I should be able to view available doctors in the selected specialization for the chosen date.
- **Rules:** Doctors must have valid consultation fees and available unbooked timeslots.

**1.4 Filter by Ratings**
- **Actor:** Patient
- **Description:** As a user, I should be able to filter the displayed doctors based on their average patient ratings.

**1.5 Doctor Selection & View Time Slots**
- **Actor:** Patient
- **Description:** As a user, I can click on a doctor from the list to view their detailed profile, ratings, and a grid of available and unavailable time slots for the selected date.

**1.6 Book Appointment**
- **Actor:** Patient
- **Description:** As a user, I should be able to select an open time slot and book an appointment with the selected doctor.
- **Post-Conditions:** A confirmed booking is created, and the time slot is rendered unavailable for others.

**1.7 Receive Confirmation**
- **Actor:** Patient
- **Description:** As a user, I should receive an immediate real-time toast notification (via SignalR) confirming my booking success.

**1.8 Cancel Appointment**
- **Actor:** Patient
- **Description:** As a user, I should be able to navigate to my appointments list and cancel an upcoming appointment.
- **Post-Conditions:** The system marks the appointment as 'Cancelled' and frees up the time slot.

**1.9 Rate and Review Doctor**
- **Actor:** Patient
- **Description:** Post-appointment, users can rate (1-5 stars) and review the doctor.
- **Post-Conditions:** The doctor's average rating is automatically recalculated.

**1.10 Upload Profile Image**
- **Actor:** Patient
- **Description:** As a user, I can upload a profile picture from my device to personalize my account.

---

### 2. Admin Stories

**2.1 Admin Authentication**
- **Actor:** System Administrator
- **Description:** As an admin, I should be able to log in with an admin-level account to access the administrative dashboard.

**2.2 CRUD on Users**
- **Actor:** System Administrator
- **Description:** As an admin, I can view, update, and delete all user records from the system. (Cascade delete removes their appointments and ratings).

**2.3 CRUD on Doctors & Specializations**
- **Actor:** System Administrator
- **Description:** As an admin, I can add new specializations, onboard new doctors specifying their city, fee, and credentials, and manage existing doctor records (including uploading profile images for doctors).

**2.4 Manage Appointments**
- **Actor:** System Administrator
- **Description:** As an admin, I can view all system-wide appointments. I should be able to cancel conflicting appointments or confirm pending ones, generating real-time SignalR notifications for users.
