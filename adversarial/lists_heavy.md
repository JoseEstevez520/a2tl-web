# Weekly Team Sync — Sprint 14

## Attendees
- Maria (PM)
- Carlos (Backend Lead)
- Ana (Frontend)
- Pedro (DevOps)
- Laura (QA)

## Agenda
- Sprint review
- Blockers discussion
- Next sprint planning
- Hiring update

## Sprint 14 Review

### Completed
- User authentication refactor
- Database migration to PostgreSQL 16
- Landing page redesign
- API rate limiting middleware
- Logging pipeline upgrade
- Mobile push notification service
- CSV export for admin dashboard
- Password reset flow bugfix

### In Progress
- Payment gateway integration
  - Stripe webhook handler done
  - PayPal adapter pending
  - Invoice PDF generation started
- Search microservice
  - Elasticsearch cluster configured
  - Indexing pipeline at 60%
  - Query API not started
- Admin role permissions
  - Role model defined
  - UI for role assignment in review
  - Audit log integration pending

### Blocked
- iOS certificate renewal — waiting on Apple
- CDN migration — vendor contract not signed
- SSO integration — identity provider docs outdated

## Action Items
- [ ] Maria: schedule design review for mobile screens by Friday
- [ ] Carlos: write RFC for event-driven architecture proposal
- [ ] Ana: fix responsive layout bugs on Safari
- [ ] Pedro: set up staging environment for payment testing
- [ ] Laura: create regression test suite for auth module
- [ ] Maria: send updated roadmap to stakeholders
- [ ] Carlos: review PR #347 and PR #352 by Wednesday
- [ ] Ana: prototype dark mode toggle component
- [ ] Pedro: configure alerting for new database cluster
- [ ] Laura: document edge cases for CSV export

## Blockers Discussion

### iOS Certificate
- Submitted renewal request on June 28
- Apple support ticket #4821093
- Estimated resolution: 5-7 business days
- Workaround: use TestFlight for internal builds

### CDN Migration
- Three vendors evaluated:
  - CloudFront — best pricing, complex setup
  - Fastly — best DX, higher cost
  - Cloudflare — balanced, limited custom rules
- Decision needed from VP Engineering
- Blocking 3 frontend performance tickets

### SSO Integration
- Okta docs last updated 2024
- Missing SCIM provisioning endpoints
- Alternative: use Auth0 as middleware
- Need POC by end of next sprint

## Next Sprint Planning

### Must Have
- Complete payment gateway integration
- Fix 5 critical bugs from QA backlog
- Deploy search service to staging
- Update API documentation

### Should Have
- Dark mode support
- Performance audit for dashboard
- Add monitoring dashboards to Grafana

### Nice to Have
- Animated onboarding flow
- Keyboard shortcuts for power users
- Bulk operations in admin panel

## Hiring Update
- Backend engineer — 3 candidates in pipeline
  - Phone screen scheduled: July 9
  - Take-home sent: 2 candidates
  - Offer stage: 0
- Frontend engineer — position posted
  - Applications received: 47
  - Screening: in progress
  - Interviews: not started
- QA engineer — on hold pending budget approval

## Recurring Issues
- Flaky CI tests
  - 3 tests randomly failing on Node 20
  - Docker image caching inconsistent
  - GitHub Actions runner timeouts
- Slow code review turnaround
  - Average time to first review: 2.3 days
  - Target: under 1 day
  - Proposal: daily review slot 10-11am
- Documentation gaps
  - API docs missing 12 endpoints
  - No onboarding guide for new devs
  - Architecture decision records not maintained

## Decisions Made
- Adopt Fastly as CDN provider
- Move to biweekly releases starting Sprint 16
- Require PR approval from 2 reviewers
- Sunset legacy API v1 by September 30
- Add TypeScript strict mode to all new modules

## Next Meeting
- Date: July 14, 2026
- Time: 10:00 AM CET
- Location: Room 3B / Zoom link in calendar
