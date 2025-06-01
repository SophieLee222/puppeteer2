Feature: Movie ticket booking

  Scenario: Successful booking for tomorrow
    Given I open the booking page
    And I select day with index 1
    When I book "Унесенные ветром." in "Зал 1" for "17:00"
    Then I should be redirected to the hall page
    And I select a free seat and confirm booking
    Then I should be redirected to the payment page
    And the booking details should show "Унесенные ветром.", "Зал 1", "17:00"

  Scenario: Successful booking for the day after tomorrow
    Given I open the booking page
    And I select day with index 2
    When I book "Ведьмак" in "Вип зал" for "20:00"
    Then I should be redirected to the hall page
    And I select a free seat and confirm booking
    Then I should be redirected to the payment page
    And the booking details should show "Ведьмак", "Вип зал", "20:00"

  Scenario: Booking unavailable for today at 00:00
    Given I open the booking page
    And I select day with index 0
    When I try to book "Микки Маус" in "Зал 2" for "00:00"
    Then I should see an error that the showtime is not clickable

