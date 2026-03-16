-- Database Schema for Fractoo Online Doctor Appointment Booking Platform

CREATE TABLE [Specializations] (
    [SpecializationId] int NOT NULL IDENTITY,
    [SpecializationName] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Specializations] PRIMARY KEY ([SpecializationId])
);

CREATE TABLE [Users] (
    [UserId] int NOT NULL IDENTITY,
    [Username] nvarchar(50) NOT NULL,
    [Email] nvarchar(100) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Role] nvarchar(max) NOT NULL,
    [ProfileImagePath] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
);

CREATE TABLE [Doctors] (
    [DoctorId] int NOT NULL IDENTITY,
    [Name] nvarchar(100) NOT NULL,
    [SpecializationId] int NOT NULL,
    [City] nvarchar(max) NOT NULL,
    [Rating] decimal(18,2) NOT NULL,
    [ProfileImagePath] nvarchar(max) NULL,
    [Email] nvarchar(max) NOT NULL,
    [Phone] nvarchar(max) NOT NULL,
    [About] nvarchar(max) NULL,
    [ExperienceYears] int NOT NULL,
    [ConsultationFee] decimal(18,2) NOT NULL,
    CONSTRAINT [PK_Doctors] PRIMARY KEY ([DoctorId]),
    CONSTRAINT [FK_Doctors_Specializations_SpecializationId] FOREIGN KEY ([SpecializationId]) REFERENCES [Specializations] ([SpecializationId]) ON DELETE CASCADE
);

CREATE TABLE [Appointments] (
    [AppointmentId] int NOT NULL IDENTITY,
    [UserId] int NOT NULL,
    [DoctorId] int NOT NULL,
    [AppointmentDate] datetime2 NOT NULL,
    [TimeSlot] nvarchar(20) NOT NULL,
    [Status] nvarchar(20) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Appointments] PRIMARY KEY ([AppointmentId]),
    CONSTRAINT [FK_Appointments_Doctors_DoctorId] FOREIGN KEY ([DoctorId]) REFERENCES [Doctors] ([DoctorId]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Appointments_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION
);

CREATE TABLE [Ratings] (
    [RatingId] int NOT NULL IDENTITY,
    [DoctorId] int NOT NULL,
    [UserId] int NOT NULL,
    [RatingValue] int NOT NULL,
    [Review] nvarchar(500) NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Ratings] PRIMARY KEY ([RatingId]),
    CONSTRAINT [FK_Ratings_Doctors_DoctorId] FOREIGN KEY ([DoctorId]) REFERENCES [Doctors] ([DoctorId]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Ratings_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION
);

-- Indexes
CREATE INDEX [IX_Appointments_DoctorId] ON [Appointments] ([DoctorId]);
CREATE INDEX [IX_Appointments_UserId] ON [Appointments] ([UserId]);
CREATE INDEX [IX_Doctors_SpecializationId] ON [Doctors] ([SpecializationId]);
CREATE INDEX [IX_Ratings_DoctorId] ON [Ratings] ([DoctorId]);
CREATE UNIQUE INDEX [IX_Ratings_UserId_DoctorId] ON [Ratings] ([UserId], [DoctorId]);
CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username]);
