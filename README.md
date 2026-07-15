# Beit HaKerem Jobs - Regional Employment Platform

A regional web platform that collects and presents job opportunities in informal education across the Beit HaKerem cluster municipalities. The goal of the project is to strengthen the local workforce and improve access to employment opportunities in the area.

## Target Audience

- Students and young adults from the region
- Job seekers in the field of informal education (youth work, community work, instruction)
- Municipalities and youth departments looking to publish open positions

## Main Features

- **Job search** - browse jobs with filters by city, job type, employment percent, organization and suitability for students
- **Job applications** - apply to jobs with a CV file, as a registered user or as a guest
- **Personal dashboard** - registered users can manage their profile, CV and track the applications they submitted
- **Admin dashboard** - admins can publish, edit and delete jobs, view applications and manage other admins
- **Job import** - import jobs from an external API (Remotive) and from a curated local feed
- **Email notifications** - applicants get an email when a job they applied to is updated or removed
- **AI chat assistant** - helps users find relevant jobs
- **Two languages** - full Hebrew and Arabic support
- **Security** - CV files are encrypted (AES-256) before they are stored, passwords are hashed with bcrypt, and duplicate applications are blocked with unique database indexes

## Tech Stack

| Part | Technology |
|------|------------|
| Frontend | React + Vite, Tailwind CSS |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Real time | WebSocket (live statistics updates) |
| Deployment | Vercel (client), Render (server), MongoDB Atlas |


## About

This project was developed as part of a Web Development course
