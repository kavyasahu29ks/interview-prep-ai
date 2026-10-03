const definitions = {
  'Manual Testing': [
    ['What is the main purpose of exploratory testing?', 'Learn about the product while designing and executing tests', ['Execute only prewritten scripts', 'Verify code style', 'Measure server capacity'], 'Exploratory testing combines learning, test design, and execution.', 'Exploratory testing'],
    ['Which technique is useful when test cases should cover values around a boundary?', 'Boundary value analysis', ['Pairwise coding', 'Statement formatting', 'Database normalization'], 'Boundary value analysis targets values at and around input limits.', 'Boundary Value Analysis'],
    ['A tester cannot reproduce a reported issue. What is the best next step?', 'Collect environment, data, and exact reproduction details', ['Close it immediately', 'Change the expected result', 'Assign it to development without notes'], 'Reproduction context helps distinguish environment or data-specific failures.', 'Reproducibility'],
    ['What should a tester do when expected behavior is unclear?', 'Clarify the requirement with the product or analysis owner', ['Guess and mark the test passed', 'Skip all related tests', 'Change production behavior'], 'Ambiguity should be resolved with the requirement owner and documented.', 'Requirement Clarification'],
    ['Which activity is an example of negative testing?', 'Submit an invalid email format and verify validation', ['Submit valid data once', 'Review the page color', 'Install a browser update'], 'Negative testing checks how the system handles invalid or unexpected input.', 'Negative Testing'],
    ['What is a test oracle?', 'A source used to determine the expected result', ['A tool that writes production code', 'A defect priority field', 'A browser cache'], 'An oracle can be a requirement, business rule, reference system, or specification.', 'Expected Results'],
    ['When is re-testing performed?', 'After a defect fix to verify the specific issue is resolved', ['Before any test execution', 'Only during deployment', 'Instead of regression testing'], 'Re-testing validates the repaired behavior for the reported defect.', 'Re-testing'],
    ['What is the value of an independent test perspective?', 'It can reveal assumptions and defects overlooked by authors', ['It guarantees defect-free software', 'It removes the need for requirements', 'It replaces all automation'], 'Independent testing can reduce confirmation bias and expose overlooked risks.', 'Test Independence'],
    ['Which evidence is most useful for a UI defect?', 'A clear reproduction sequence with screenshots or a recording', ['A vague one-line opinion', 'A list of unrelated files', 'Only the tester name'], 'Visual evidence and exact steps help the team reproduce and diagnose UI behavior.', 'Evidence Collection'],
    ['What does risk-based testing prioritize?', 'Testing areas by likelihood and impact of failure', ['Testing alphabetically', 'Testing only easy features', 'Testing every feature for equal time'], 'Risk-based testing focuses limited effort on the most consequential risks.', 'Risk-based Testing']
  ],
  'Test Cases': [
    ['Which fields make a test case easiest to execute consistently?', 'Preconditions, steps, test data, and expected result', ['Only a feature title', 'Developer estimates only', 'A release date and logo'], 'Clear setup, steps, data, and expected outcomes make execution repeatable.', 'Test Case Structure'],
    ['A test case has no expected result. What is the primary risk?', 'Pass or fail becomes subjective', ['The test runs faster', 'The build is automatically blocked', 'The test data becomes encrypted'], 'Expected results establish an objective basis for evaluation.', 'Expected Results'],
    ['What is a useful way to avoid redundant test cases?', 'Review coverage and remove cases that verify the same behavior without added value', ['Duplicate every test', 'Delete all negative cases', 'Use one test for the entire product'], 'Coverage review preserves distinct risks while reducing needless duplication.', 'Test Coverage'],
    ['What should a test case ID provide?', 'A stable unique reference for tracking and reporting', ['The expected result itself', 'A user password', 'A guarantee of execution order'], 'A stable identifier supports traceability across plans, runs, and defects.', 'Traceability'],
    ['Which test case best verifies a minimum allowed age of 18?', 'Check 17, 18, and 19', ['Check 1, 50, and 99 only', 'Check only 18', 'Check blank and alphabetic input only'], 'Values below, at, and above the boundary expose boundary errors.', 'Boundary Value Analysis'],
    ['When should test data be documented?', 'When setup data is needed to reproduce the expected behavior', ['Never', 'Only after a defect is closed', 'Only for automated tests'], 'Documented data makes cases repeatable and clarifies dependencies.', 'Test Data'],
    ['How does requirement traceability help test cases?', 'It shows which requirements are covered and where gaps remain', ['It replaces execution evidence', 'It removes the need for expected results', 'It automatically fixes defects'], 'Traceability connects requirements to verification and helps identify uncovered needs.', 'Traceability'],
    ['What is the best response when a test case fails due to an environment outage?', 'Record the blocker and distinguish it from a product defect', ['Mark the product defect confirmed', 'Change expected results to pass', 'Delete the test case'], 'Environment failures should be reported separately from application behavior.', 'Execution Status'],
    ['Which test case is most maintainable?', 'One with focused intent and minimal unrelated setup', ['One combining many independent features', 'One with hidden prerequisites', 'One using unexplained data'], 'Focused cases are easier to diagnose and update when behavior changes.', 'Maintainability'],
    ['What does a test case precondition describe?', 'The state that must exist before the steps begin', ['The final test verdict', 'The defect priority', 'The deployment date'], 'Preconditions define the system or data state needed for execution.', 'Preconditions']
  ],
  'Test Scenarios': [
    ['What is a test scenario?', 'A high-level situation or workflow to validate', ['A single database column', 'A code review comment', 'A defect severity value'], 'Scenarios describe what to test at a broad level before detailed cases.', 'Scenario Design'],
    ['Which is the strongest scenario for an online checkout?', 'Complete purchase with valid payment and verify order confirmation', ['Open the home page only', 'Change the browser wallpaper', 'Read the footer text only'], 'An end-to-end scenario validates the core customer transaction.', 'End-to-end Flows'],
    ['How should scenarios be prioritized?', 'By user impact, business risk, and likelihood of failure', ['By title length', 'By the order they were written', 'By tester preference only'], 'Risk and business criticality guide useful scenario priority.', 'Risk Prioritization'],
    ['A login feature supports locked accounts. Which scenario matters?', 'Attempt login after the account reaches its lockout threshold', ['Change profile color', 'Sort a product list', 'Download a receipt'], 'The scenario validates an important security and account-state path.', 'Account States'],
    ['Why include alternate flows in scenarios?', 'They cover valid paths other than the main happy path', ['They make requirements unnecessary', 'They guarantee no defects', 'They replace test data'], 'Alternate paths capture meaningful choices and variations in user behavior.', 'Alternate Flows'],
    ['Which scenario best checks session timeout?', 'Leave an authenticated session idle until expiry, then attempt a protected action', ['Refresh immediately after login', 'Open two public pages', 'Change the device clock only'], 'This verifies timeout behavior and protection of expired sessions.', 'Session Management'],
    ['What should a scenario say when a requirement is ambiguous?', 'Record the ambiguity and seek clarification before finalizing expected behavior', ['Invent an expected result', 'Skip all future tests', 'Approve the feature automatically'], 'Scenario quality depends on shared understanding of expected outcomes.', 'Requirement Clarification'],
    ['Which scenario checks an interrupted file upload?', 'Disconnect during upload and verify recovery or a clear failure state', ['Upload a small file once', 'Rename the browser', 'Open the help page'], 'Interruption scenarios test resilience and user feedback.', 'Failure Recovery'],
    ['How can scenario coverage be checked?', 'Map scenarios back to requirements and important user journeys', ['Count screenshots only', 'Review source filenames', 'Compare team calendars'], 'Mapping exposes important journey or requirement gaps.', 'Coverage Mapping'],
    ['What is a useful scenario for role-based access?', 'Try the same protected action with roles that should and should not have access', ['Use one administrator account only', 'Change the screen resolution', 'Test an unrelated search'], 'Comparing allowed and denied roles validates authorization boundaries.', 'Authorization']
  ],
  'Bug Reporting / Defect Management': [
    ['Which defect title is most actionable?', 'Checkout returns 500 after applying a valid discount code', ['Checkout is bad', 'Please fix this', 'Issue number 17'], 'A concise title states the affected area and observable failure.', 'Defect Reporting'],
    ['What should a defect reproduction section contain?', 'Ordered steps, preconditions, and relevant test data', ['A proposed code patch only', 'Unrelated project history', 'The reporter’s opinion only'], 'Reproducible context helps others confirm and diagnose the defect.', 'Reproduction Steps'],
    ['What is severity?', 'The impact of a defect on the system or user', ['The order a developer picks it up', 'The age of the ticket', 'The number of comments'], 'Severity measures consequence; it is distinct from scheduling priority.', 'Severity vs Priority'],
    ['What is priority?', 'The urgency or order in which a defect should be addressed', ['The technical impact only', 'The test case ID', 'The number of affected files'], 'Priority guides work sequencing and may differ from severity.', 'Severity vs Priority'],
    ['A typo appears on a legal consent screen. What is a reasonable assessment?', 'Potentially high priority because of compliance impact, even if technically small', ['Always lowest severity and priority', 'Not a defect because it is text', 'Automatically a security incident'], 'Business and regulatory context can raise priority beyond technical scope.', 'Business Impact'],
    ['What evidence is useful for a backend defect?', 'Request/response details with sensitive values removed', ['A plaintext password', 'A JWT copied into the ticket', 'An unrelated UI screenshot only'], 'Sanitized diagnostics aid reproduction without exposing credentials.', 'Safe Evidence'],
    ['When should a defect be reopened?', 'When verification shows the reported behavior still occurs', ['Whenever a new comment is added', 'Before the fix is available', 'When the reporter changes teams'], 'Reopen when the agreed fix does not resolve the original issue.', 'Defect Lifecycle'],
    ['What is a duplicate defect?', 'A report of an issue already tracked by another defect', ['A defect with two screenshots', 'A low-priority issue', 'A regression test'], 'Duplicates should reference the primary issue to consolidate tracking.', 'Duplicate Management'],
    ['How should a non-reproducible defect be handled?', 'Request missing context and investigate environment or data differences', ['Assume it is fixed', 'Delete the report without notes', 'Raise priority to critical automatically'], 'More evidence is needed before disposition.', 'Reproducibility'],
    ['What does defect triage decide?', 'Validity, impact, priority, ownership, and next action', ['The final release date alone', 'Which test framework to install', 'The user’s password policy'], 'Triage aligns stakeholders on how the issue should be handled.', 'Triage']
  ],
  'SDLC': [
    ['What is the main purpose of requirements analysis in SDLC?', 'Understand stakeholder needs and define expected system behavior', ['Deploy without review', 'Write test results before implementation', 'Delete the product backlog'], 'Analysis clarifies scope, constraints, and acceptance expectations.', 'Requirements Analysis'],
    ['Which activity commonly belongs to design?', 'Define architecture and component interactions', ['Close production incidents only', 'Execute final acceptance tests', 'Archive user accounts'], 'Design translates requirements into a technical solution structure.', 'System Design'],
    ['Why is testing included in the development lifecycle?', 'To provide evidence that behavior meets requirements and expose risk', ['To guarantee zero defects', 'To replace product discovery', 'To avoid maintenance'], 'Testing supports quality decisions but cannot prove the absence of all defects.', 'Verification'],
    ['What is a key purpose of deployment planning?', 'Release the change safely and make rollback or recovery possible', ['Create requirements retroactively', 'Remove all monitoring', 'Skip user communication'], 'Deployment planning manages rollout, compatibility, and recovery risks.', 'Release Management'],
    ['What does maintenance cover after release?', 'Corrections, adaptations, and improvements to the software', ['Only the first design meeting', 'Only hiring', 'Only test case writing'], 'Maintenance addresses issues and changing needs after delivery.', 'Maintenance'],
    ['What is a benefit of iterative development?', 'Feedback can be incorporated in smaller delivery cycles', ['Requirements never change', 'Testing is unnecessary', 'All work waits until project end'], 'Iterations provide frequent opportunities to learn and adjust.', 'Iterative Delivery'],
    ['Who typically owns acceptance criteria for a feature?', 'Product or business stakeholders with the delivery team', ['Only the database server', 'An unrelated end user account', 'The compiler'], 'Acceptance criteria should reflect agreed stakeholder outcomes.', 'Acceptance Criteria'],
    ['What is technical debt?', 'Future cost caused by expedient or suboptimal implementation choices', ['A customer invoice', 'A test environment outage', 'A release note'], 'Debt can increase maintenance effort if not deliberately managed.', 'Technical Debt'],
    ['Why use version control in SDLC?', 'Track changes and support collaboration and recovery', ['Guarantee requirements are correct', 'Replace code review', 'Encrypt every user record automatically'], 'Version control provides history, collaboration, and rollback support.', 'Configuration Management'],
    ['Which practice helps discover defects earlier in SDLC?', 'Review requirements and design before implementation', ['Wait for production reports', 'Remove acceptance criteria', 'Test only after a year'], 'Early reviews can catch misunderstandings before they become costly changes.', 'Shift-left Quality']
  ],
  'STLC': [
    ['What is the first major STLC activity after a requirement is available?', 'Analyze testability and identify test conditions', ['Close the test cycle', 'Deploy the product', 'Archive all defects'], 'Test analysis identifies what can be verified and what evidence is needed.', 'Test Analysis'],
    ['What is produced during test planning?', 'Scope, approach, resources, schedule, and risks', ['A production database backup only', 'A list of final defects only', 'The application source code'], 'The plan explains how testing will be organized and controlled.', 'Test Planning'],
    ['What is test design?', 'Creating test cases, data, and coverage from test conditions', ['Writing release marketing copy', 'Approving a budget only', 'Removing requirements'], 'Design turns identified conditions into executable verification.', 'Test Design'],
    ['When does test environment setup occur?', 'Before execution, to provide required hardware, software, and configuration', ['Only after sign-off', 'Before requirements exist', 'After deleting test data'], 'A representative environment is needed for meaningful execution.', 'Environment Setup'],
    ['What is the purpose of test execution?', 'Run tests, compare actual with expected results, and record evidence', ['Change requirements silently', 'Assign all defects to users', 'Generate production credentials'], 'Execution produces observed results and traceable status.', 'Test Execution'],
    ['What is a test exit criterion?', 'A measurable condition used to decide whether testing can conclude', ['A tester’s office location', 'A random test name', 'A database index'], 'Exit criteria make completion decisions explicit.', 'Exit Criteria'],
    ['What is checked during test closure?', 'Results, unresolved risks, artifacts, and lessons learned', ['Only the next sprint theme', 'Only the UI font', 'Only developer attendance'], 'Closure summarizes outcomes and preserves useful learning.', 'Test Closure'],
    ['How does traceability support STLC?', 'It connects requirements, tests, and defects', ['It replaces test execution', 'It hides uncovered requirements', 'It runs tests automatically'], 'Traceability helps assess coverage and change impact.', 'Traceability'],
    ['What should happen when requirements change during testing?', 'Assess impact and update affected tests and coverage', ['Continue using stale tests without review', 'Delete every test result', 'Ignore the change until release'], 'Change impact analysis keeps verification aligned with current behavior.', 'Change Management'],
    ['What is a test deliverable?', 'A testing artifact such as a plan, case set, report, or closure summary', ['A production password', 'A customer’s personal device', 'An unrelated build failure'], 'Deliverables provide evidence and reusable testing information.', 'Test Deliverables']
  ],
  'Functional Testing': [
    ['What does functional testing verify?', 'That features behave according to specified requirements', ['Only CPU temperature', 'Only source code formatting', 'Only network cabling'], 'Functional tests validate observable feature behavior.', 'Feature Behavior'],
    ['A user submits a valid registration form. What should a functional test verify?', 'Account creation and the expected confirmation behavior', ['Only the page background', 'The compiler version', 'An unrelated report export'], 'The test should verify the user-visible result of the action.', 'Registration'],
    ['Which is a useful functional test for search?', 'Search for a known item and verify relevant results are shown', ['Measure keyboard color', 'Run a database backup', 'Check a different feature'], 'The result should match the specified search behavior.', 'Search'],
    ['What should a role-permission functional test verify?', 'Permitted actions succeed and restricted actions are denied', ['Every user is an administrator', 'Passwords appear in page source', 'Permissions are ignored'], 'Functional access tests check expected outcomes for each role.', 'Authorization'],
    ['Why test validation messages?', 'Users should receive accurate feedback for invalid input', ['Messages replace validation rules', 'They guarantee performance', 'They remove the need for tests'], 'Feedback is part of the specified functional response.', 'Input Validation'],
    ['What is a positive functional test?', 'Use valid input and verify the expected successful behavior', ['Use only corrupted data', 'Disable the application', 'Change unrelated settings'], 'Positive tests cover valid, expected usage.', 'Positive Testing'],
    ['A payment is declined. What should a functional test verify?', 'The decline is communicated and no successful charge/order is recorded', ['A success receipt is always created', 'The card number is displayed', 'All retries are unlimited'], 'The system should maintain consistent behavior for declined transactions.', 'Payment Processing'],
    ['What is a good test for a required field?', 'Submit without the field and verify the specified validation response', ['Submit only valid values', 'Check an unrelated dropdown', 'Restart the browser'], 'Required-field validation is part of the feature contract.', 'Required Fields'],
    ['What should a functional test do when actual behavior differs from expected?', 'Record the discrepancy with enough evidence to reproduce it', ['Alter expected behavior to match', 'Hide the failure', 'Mark it passed'], 'Discrepancies need accurate evidence and traceable reporting.', 'Defect Evidence'],
    ['Which test confirms an export function?', 'Export the requested data and verify format and content', ['Open a settings menu only', 'Change the account password', 'Review unrelated logs'], 'The exported artifact should meet the feature specification.', 'Data Export']
  ],
  'Regression Testing': [
    ['What is the goal of regression testing?', 'Check that changes have not broken existing behavior', ['Prove new code has no bugs', 'Replace all requirements', 'Measure only network speed'], 'Regression testing detects unintended side effects from changes.', 'Regression Purpose'],
    ['Which tests should be prioritized after changing a shared login component?', 'Tests for login and features that depend on authentication', ['Only unrelated color themes', 'Only archived features', 'No tests if compilation succeeds'], 'Change impact and dependency analysis guide regression scope.', 'Change Impact'],
    ['When should a regression suite be updated?', 'When product behavior or risk coverage changes', ['Never after the first release', 'After each test passes only', 'Only when a tester changes'], 'The suite should reflect current behavior and important risks.', 'Suite Maintenance'],
    ['Why automate stable regression checks?', 'They can be repeated quickly and consistently', ['Automation removes all maintenance', 'They no longer need assertions', 'They guarantee every defect is found'], 'Automation helps frequent repeat execution but still needs maintenance.', 'Regression Automation'],
    ['What is a risk of rerunning every test after a tiny change?', 'It may use time inefficiently when impact is well understood', ['It always reduces quality', 'It changes the source code', 'It makes tests invalid'], 'A risk-based scope can balance confidence with available time.', 'Regression Scope'],
    ['A defect fix changes a shared date parser. What is a sensible regression target?', 'Date-related features that use the shared parser', ['Only the login logo', 'No tests outside the fixed screen', 'Only network throughput'], 'Shared dependency changes can affect multiple consumers.', 'Shared Components'],
    ['What is a smoke test compared with regression testing?', 'Smoke checks basic build stability; regression checks broader existing behavior', ['They are always identical', 'Regression only tests installation', 'Smoke tests cover all possible paths'], 'Smoke is a quick subset; regression aims to uncover unintended changes.', 'Smoke vs Regression'],
    ['How can flaky regression tests harm a team?', 'They reduce trust and make real failures harder to notice', ['They always reveal more defects', 'They prevent code changes', 'They remove false alarms'], 'Unstable tests create noise and should be investigated.', 'Flaky Tests'],
    ['What is a good regression test case?', 'A repeatable check for an important existing behavior', ['A vague exploratory note only', 'A test with changing expected results', 'A duplicate without added coverage'], 'Reliable, risk-focused tests provide meaningful regression confidence.', 'Regression Case Quality'],
    ['After a regression failure, what should be checked first?', 'Whether the failure is reproducible and related to the change', ['Delete the test immediately', 'Change the expected result without review', 'Ignore the build'], 'Triage distinguishes product regressions from test or environment failures.', 'Failure Triage']
  ],
  'Smoke Testing': [
    ['What is smoke testing intended to determine?', 'Whether the build is stable enough for deeper testing', ['Whether every edge case passes', 'Whether the UI is beautiful', 'Whether all requirements are final'], 'Smoke testing is a broad, shallow build confidence check.', 'Smoke Purpose'],
    ['Which is a suitable smoke test after deployment to staging?', 'Open the app, authenticate, and load a key page', ['Test every possible input combination', 'Run a year-long load test', 'Review unrelated source comments'], 'A few critical paths can reveal a fundamentally unusable build.', 'Critical Paths'],
    ['A smoke test fails because the app will not start. What is the likely decision?', 'Stop deeper testing and report the blocking build failure', ['Continue all cases as if normal', 'Mark the build accepted', 'Delete the environment'], 'A failed smoke check means the build may not support useful testing.', 'Build Acceptance'],
    ['How deep should a typical smoke test be?', 'Broad coverage of critical functions with limited depth', ['Exhaustive coverage of every condition', 'Only a single pixel check', 'No execution'], 'Smoke tests favor quick, critical-path checks over detailed exploration.', 'Test Depth'],
    ['When is smoke testing commonly run?', 'On a new build before committing to a full test cycle', ['Only after product retirement', 'Before any build exists', 'Instead of all development'], 'It helps decide whether a build is viable for further testing.', 'Build Verification'],
    ['Which belongs in a smoke suite for an API service?', 'Verify the service responds and a key endpoint returns a valid basic response', ['Test every security attack exhaustively', 'Measure keyboard input lag', 'Change database records manually'], 'Basic service and critical endpoint availability are smoke-level checks.', 'API Availability'],
    ['What is a smoke test not designed to prove?', 'That the product is free of defects', ['That critical startup works', 'That a key flow is available', 'That the build is testable'], 'Smoke testing offers limited confidence, not a complete quality assessment.', 'Test Limitations'],
    ['A smoke test is automated. What is still necessary?', 'Review failures and keep checks aligned with critical behavior', ['Assume it can never be flaky', 'Remove all expected results', 'Ignore test environment health'], 'Automation still needs maintenance and meaningful failure handling.', 'Automation'],
    ['Which result should stop the test team from executing detailed cases?', 'A critical login flow is broken for all users', ['A minor typo on an optional page', 'One non-blocking color mismatch', 'A test report title change'], 'A blocking failure in a critical path can invalidate deeper test execution.', 'Release Blocking'],
    ['Why keep smoke tests fast?', 'They provide quick feedback on build viability', ['They replace all regression tests', 'They avoid recording failures', 'They ensure complete coverage'], 'Fast feedback enables teams to reject broken builds early.', 'Feedback Speed']
  ],
  'Sanity Testing': [
    ['What is sanity testing commonly used for?', 'A focused check that a specific change or fix behaves as expected', ['Exhaustive validation of every feature', 'A full performance certification', 'Replacing test design'], 'Sanity testing is narrow and focused on changed behavior.', 'Sanity Purpose'],
    ['A calculation defect was fixed. What is a suitable sanity check?', 'Verify the corrected calculation and a nearby related case', ['Test every unrelated screen', 'Check only the app logo', 'Skip the fix verification'], 'Focused tests confirm the change and its immediate risk area.', 'Fix Verification'],
    ['How does sanity testing differ from smoke testing?', 'Sanity is focused on a change; smoke checks broad build stability', ['Sanity always covers more functions', 'Smoke is performed only by users', 'They have no difference in any context'], 'Sanity targets a narrow change while smoke checks basic build viability.', 'Sanity vs Smoke'],
    ['When can sanity testing be useful?', 'After a small, well-understood change before broader testing continues', ['Before a requirement exists', 'Only after system retirement', 'Instead of all quality activities'], 'Focused validation can quickly establish whether a change is basically sound.', 'Test Timing'],
    ['A sanity test passes. What does that mean?', 'The focused checks passed, not that the entire product is defect-free', ['All possible defects are gone', 'No regression testing is needed ever', 'Requirements are complete'], 'Sanity provides limited evidence for a narrow area.', 'Test Scope'],
    ['What should define the scope of sanity tests?', 'The changed behavior and directly affected areas', ['Every feature in the product', 'Only test case order', 'The developer’s favorite screen'], 'Scope should follow the change and its immediate dependencies.', 'Change Scope'],
    ['A minor CSS fix is delivered. What sanity check is appropriate?', 'Verify the affected layout at relevant viewport sizes', ['Run database migration tests', 'Test unrelated payment logic', 'Skip visual verification'], 'A focused visual check validates the specific style change.', 'UI Changes'],
    ['What should happen if the focused sanity test fails?', 'Report the failure and stop treating the change as verified', ['Mark the change done anyway', 'Hide the result', 'Delete expected behavior'], 'A failed focused check means the change needs investigation.', 'Failure Handling'],
    ['Which scenario is too broad for a sanity test?', 'Execute every test across all product modules after a small label change', ['Check the changed label', 'Check its nearby alignment', 'Check relevant responsive layout'], 'Sanity testing should stay targeted to the relevant change.', 'Scope Control'],
    ['How should a sanity result be reported?', 'State the focused scope and the observed pass or failure', ['Claim complete product certification', 'Omit test conditions', 'Replace evidence with a guess'], 'Clear scope prevents readers from over-interpreting the result.', 'Test Reporting']
  ],
  'SQL': [
    ['Which clause filters rows before grouping?', 'WHERE', ['HAVING', 'ORDER BY', 'DISTINCT'], 'WHERE filters source rows before aggregate grouping.', 'Query Filtering'],
    ['Which clause filters grouped aggregate results?', 'HAVING', ['WHERE', 'FROM', 'LIMIT'], 'HAVING applies conditions after groups and aggregates are formed.', 'Aggregation'],
    ['What does an INNER JOIN return?', 'Rows with matching join keys in both tables', ['Every row from the left table', 'Every possible row pair', 'Only rows with null keys'], 'An inner join keeps rows that match the join condition on both sides.', 'Joins'],
    ['Which join keeps every row from the left table and matching right rows?', 'LEFT JOIN', ['CROSS JOIN', 'INNER JOIN', 'RIGHT JOIN'], 'A left join preserves all left-side rows and fills unmatched right columns with NULL.', 'Joins'],
    ['What does COUNT(*) count?', 'Rows in the result, including rows with NULL columns', ['Only non-NULL values in one selected column', 'Unique values only', 'Only rows with numeric IDs'], 'COUNT(*) counts rows regardless of individual column nullability.', 'Aggregate Functions'],
    ['How do you check for a missing value in SQL?', 'Use IS NULL', ['Use = NULL', 'Use == EMPTY', 'Use LIKE NULL'], 'SQL uses IS NULL because NULL represents an unknown value.', 'NULL Handling'],
    ['What is a primary key?', 'A column or column set that uniquely identifies each row', ['A field that may duplicate freely', 'A query sorting rule', 'A temporary table alias'], 'A primary key enforces unique row identity and cannot be NULL.', 'Keys'],
    ['What is the purpose of GROUP BY?', 'Collect rows with equal values for aggregate calculations', ['Sort rows alphabetically only', 'Remove all duplicate tables', 'Restrict database access'], 'GROUP BY forms groups used by aggregate functions.', 'Grouping'],
    ['Which command changes existing row values?', 'UPDATE', ['INSERT', 'CREATE', 'SELECT'], 'UPDATE modifies data in rows matching its condition.', 'Data Modification'],
    ['What is a risk of running DELETE without a WHERE clause?', 'It can remove every row in the table', ['It only selects rows', 'It creates an index', 'It changes a column name'], 'Without a filter, DELETE targets all rows in the table.', 'Safe Data Changes']
  ],
  'API Testing': [
    ['What does an HTTP 201 status usually indicate?', 'A resource was created successfully', ['The request is unauthorized', 'The server failed internally', 'The resource was not found'], '201 Created indicates successful resource creation.', 'HTTP Status Codes'],
    ['Which status is appropriate when a request is syntactically valid but fails validation?', '400 Bad Request', ['200 OK', '301 Moved Permanently', '101 Switching Protocols'], 'A 400 response commonly reports invalid request data or syntax.', 'Validation'],
    ['What should an API contract test verify?', 'Request and response structure, types, and documented behavior', ['Only the page color', 'Only server CPU temperature', 'The developer’s editor settings'], 'Contract checks validate the expected interface between clients and service.', 'API Contracts'],
    ['Why test an endpoint with missing required fields?', 'To verify clear validation and prevent invalid processing', ['To bypass authentication', 'To generate random records', 'To test CSS rendering'], 'Invalid-input tests check robustness and predictable client feedback.', 'Negative Testing'],
    ['What is an idempotent operation?', 'Repeating it has the same intended effect as performing it once', ['It always creates another record', 'It requires a browser refresh', 'It returns only XML'], 'Idempotency matters for safe retries, especially with HTTP methods like PUT.', 'Idempotency'],
    ['How should an API test handle authorization tokens?', 'Use protected test secrets and never include them in logs or reports', ['Paste them into public issue trackers', 'Commit them to source control', 'Return them in response assertions'], 'Credentials must be handled securely throughout testing.', 'API Security'],
    ['What is a useful API boundary test?', 'Try values just below, at, and above documented limits', ['Test only a typical value', 'Change the server port randomly', 'Delete the API schema'], 'Boundary checks reveal off-by-one and limit-handling defects.', 'Boundary Testing'],
    ['Which assertion verifies a JSON response field correctly?', 'Check the field exists and has the documented type/value', ['Check only that bytes were received', 'Check the browser title', 'Check an unrelated database'], 'Assertions should validate meaningful response semantics.', 'Response Validation'],
    ['What is a common purpose of a correlation ID?', 'Trace a request across logs and services', ['Authenticate a user by itself', 'Encrypt the response body', 'Replace HTTP status codes'], 'Correlation IDs help diagnose a request path across components.', 'Observability'],
    ['How should an API behave after an unsupported HTTP method?', 'Return an appropriate client error such as 405 when supported by the server', ['Pretend the operation succeeded', 'Expose the API key', 'Delete the resource'], 'Unsupported methods should fail clearly without unintended side effects.', 'HTTP Methods']
  ],
  'Selenium': [
    ['What is Selenium WebDriver used for?', 'Automating browser interactions for web applications', ['Managing database backups', 'Compiling JavaScript', 'Designing network hardware'], 'WebDriver provides a browser automation interface.', 'WebDriver Basics'],
    ['Why prefer an explicit wait for a dynamic element?', 'It waits for a specific condition and avoids fixed unnecessary delays', ['It disables the browser', 'It guarantees every locator is correct', 'It removes assertions'], 'Explicit waits synchronize with a condition such as visibility or clickability.', 'Wait Strategies'],
    ['What makes a locator brittle?', 'Depending on changing layout position or generated identifiers', ['Using a stable unique test attribute', 'Using an accessible label', 'Using a documented ID'], 'Stable semantic locators survive UI layout changes better.', 'Locators'],
    ['When is a Page Object useful?', 'To centralize page interactions and reduce duplicated UI details', ['To store user passwords in code', 'To bypass assertions', 'To replace all test data'], 'Page Objects improve reuse and separate page mechanics from test intent.', 'Page Object Model'],
    ['What should a Selenium test assert after submitting a form?', 'The expected result is visible or otherwise observable', ['That a click was attempted only', 'That the test completed without exceptions only', 'That the browser opened'], 'An assertion verifies behavior, not merely that an action ran.', 'Assertions'],
    ['How should a flaky element lookup be investigated?', 'Check timing, locator stability, and page state', ['Add a very long fixed sleep immediately', 'Remove the assertion', 'Retry forever'], 'Flakiness often comes from synchronization or unstable selectors.', 'Flaky Tests'],
    ['What does Selenium Grid help with?', 'Running browser tests across multiple machines or configurations', ['Writing SQL joins', 'Replacing application authentication', 'Editing screenshots'], 'Grid distributes browser sessions for parallel or cross-browser execution.', 'Selenium Grid'],
    ['How should test cleanup handle a browser session?', 'Quit the driver so the session and process are released', ['Leave every browser open', 'Delete the source repository', 'Disable all assertions'], 'Quitting the driver releases browser resources after a test.', 'Resource Cleanup'],
    ['Which locator strategy is generally preferable when available?', 'A stable unique ID or accessible/test attribute', ['The third div under the second section', 'A pixel coordinate', 'A generated class that changes every build'], 'Stable semantic locators reduce fragile tests.', 'Locator Strategy'],
    ['What is a good way to reduce cross-test interference?', 'Use isolated test data and reset state between tests', ['Share mutable records across all tests', 'Depend on test order', 'Skip cleanup'], 'Isolation makes results repeatable and easier to diagnose.', 'Test Isolation']
  ],
  'Automation Testing': [
    ['Which test is usually the best candidate for automation?', 'A stable, repeatable, high-value check run frequently', ['A one-time exploratory investigation', 'A changing requirement with no expected result', 'A test that cannot be observed'], 'Automation pays off when repeatability and frequency justify maintenance.', 'Automation Candidates'],
    ['What is a test assertion?', 'A check that compares observed behavior with an expected condition', ['A random delay', 'A build artifact', 'A test environment variable'], 'Assertions make automated tests capable of reporting pass or failure.', 'Assertions'],
    ['Why can too many UI-only automated tests be costly?', 'They may be slower and more fragile than lower-level checks', ['They never find defects', 'They eliminate integration testing', 'They require no maintenance'], 'A balanced test pyramid uses fast lower-level tests alongside critical UI flows.', 'Test Pyramid'],
    ['What should an automation failure report include?', 'The failed assertion and useful context such as logs or screenshots', ['Only the word failed', 'A secret token', 'Unrelated source files'], 'Actionable diagnostics reduce time spent reproducing failures.', 'Failure Diagnostics'],
    ['Why avoid hard-coded sleeps in test automation?', 'They make tests slower and may still miss timing variation', ['They improve every test', 'They validate the expected result', 'They make locators stable'], 'Condition-based waits are more efficient and reliable.', 'Synchronization'],
    ['What is data-driven testing?', 'Running the same test logic with multiple input datasets', ['Writing all data into a screenshot', 'Testing only one hard-coded value', 'Removing input validation'], 'Data-driven tests broaden input coverage while reusing test logic.', 'Data-driven Tests'],
    ['How should automated test data be managed?', 'Create isolated data and clean it up safely after use', ['Share production credentials publicly', 'Use unrelated changing records', 'Skip setup documentation'], 'Controlled test data improves repeatability and avoids unintended impact.', 'Test Data Management'],
    ['What is a flaky test?', 'A test that produces inconsistent results without a relevant product change', ['A test that always passes', 'A test with no assertion by design', 'A release plan'], 'Flakiness undermines confidence and should be investigated.', 'Flaky Tests'],
    ['What is continuous integration testing intended to provide?', 'Fast feedback about changes through automated checks', ['A guarantee of perfect software', 'A replacement for code review', 'A production data migration'], 'CI runs checks early and consistently as changes are integrated.', 'Continuous Integration'],
    ['How should an automation suite be maintained?', 'Update checks when behavior changes and remove obsolete coverage', ['Never modify tests after creation', 'Ignore failures indefinitely', 'Duplicate all tests each release'], 'Test suites are software artifacts that need ongoing maintenance.', 'Suite Maintenance']
  ]
};

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const quizTopics = Object.keys(definitions);

export const normalizeQuizTopic = (value = '') => {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const aliases = [
    [['rest api', 'rest apis', 'api', 'apis'], 'API Testing'],
    [['bug reporting', 'defect management', 'bug management', 'defect reporting'], 'Bug Reporting / Defect Management'],
    [['automation', 'test automation'], 'Automation Testing'],
    [['test case', 'test cases'], 'Test Cases'],
    [['test scenario', 'test scenarios'], 'Test Scenarios']
  ];
  for (const [phrases, topic] of aliases) {
    if (phrases.some((phrase) => normalized === phrase || normalized.includes(phrase))) return topic;
  }
  return quizTopics.find((topic) => topic.toLowerCase() === normalized) || null;
};

export const getWorkspaceQuizTopics = (topics = [], skills = []) => {
  const selected = [...topics, ...skills]
    .map(normalizeQuizTopic)
    .filter(Boolean);
  return [...new Set(selected)];
};

export const getQuizQuestionBank = (topic) => {
  const canonicalTopic = normalizeQuizTopic(topic);
  const rows = definitions[canonicalTopic];
  if (!rows) return [];

  return rows.map(([question, correctAnswer, distractors, explanation, weakArea], index) => {
    const correctIndex = (index * 3 + 1) % 4;
    const options = [...distractors];
    options.splice(correctIndex, 0, correctAnswer);
    return {
      id: `${slugify(canonicalTopic)}-${index + 1}`,
      topic: canonicalTopic,
      question,
      options,
      correctAnswer,
      explanation,
      weakArea,
      correctIndex
    };
  });
};
