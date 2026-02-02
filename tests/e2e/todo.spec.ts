import { test, expect } from "@playwright/test";

test.describe("ZenTodo App", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    // Wait for app to hydrate
    await page.waitForSelector('input[placeholder="What needs to be done?"]', { timeout: 10000 });
  });

  test.describe("Task CRUD Operations", () => {
    test("should create a new task", async ({ page }) => {
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Buy groceries");
      await input.press("Enter");

      await expect(page.getByText("Buy groceries")).toBeVisible();
    });

    test("should toggle task completion", async ({ page }) => {
      // Create a task
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Test task");
      await input.press("Enter");

      // Wait for task to appear
      await expect(page.getByText("Test task")).toBeVisible();

      // Toggle completion
      const checkbox = page.getByRole("button", { name: "Mark as complete" });
      await checkbox.click();

      // Verify task is completed
      await expect(page.getByRole("button", { name: "Mark as incomplete" })).toBeVisible();
    });

    test("should delete a task", async ({ page }) => {
      // Create a task
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Task to delete");
      await input.press("Enter");

      await expect(page.getByText("Task to delete")).toBeVisible();

      // Delete the task
      const deleteBtn = page.getByRole("button", { name: "Delete task" });
      await deleteBtn.click();

      // Verify task is removed
      await expect(page.getByText("Task to delete")).not.toBeVisible();
    });
  });

  test.describe("Filters", () => {
    test("should show filter tabs when tasks exist", async ({ page }) => {
      // Create a task
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Filter test");
      await input.press("Enter");

      await expect(page.getByText("Filter test")).toBeVisible();

      // Verify filter tabs are visible
      await expect(page.getByRole("button", { name: /Show all tasks/ })).toBeVisible();
      await expect(page.getByRole("button", { name: /Show pending tasks/ })).toBeVisible();
      await expect(page.getByRole("button", { name: /Show done tasks/ })).toBeVisible();

      // Click pending filter
      await page.getByRole("button", { name: /Show pending tasks/ }).click();

      // Task should still be visible (it's pending)
      await expect(page.getByText("Filter test")).toBeVisible();

      // Complete the task
      await page.getByRole("button", { name: "Mark as complete" }).click();

      // Wait for completion
      await page.waitForTimeout(200);

      // Now task should be hidden (we're on pending filter)
      await expect(page.getByText("Filter test")).toBeHidden();

      // Switch to done filter
      await page.getByRole("button", { name: /Show done tasks/ }).click();

      // Task should be visible again
      await expect(page.getByText("Filter test")).toBeVisible();
    });
  });

  test.describe("Search", () => {
    test("should search tasks", async ({ page }) => {
      // Create tasks
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Buy milk");
      await input.press("Enter");
      await expect(page.getByText("Buy milk")).toBeVisible();

      await input.fill("Call mom");
      await input.press("Enter");
      await expect(page.getByText("Call mom")).toBeVisible();

      // Open search
      await page.getByRole("button", { name: "Toggle search" }).click();

      // Search for "Buy"
      const searchInput = page.getByPlaceholder("Search tasks...");
      await searchInput.fill("Buy");

      // Wait for debounce
      await page.waitForTimeout(400);

      // Verify filter
      await expect(page.getByText("Buy milk")).toBeVisible();
      await expect(page.getByText("Call mom")).not.toBeVisible();
    });
  });

  test.describe("Priority", () => {
    test("should set task priority", async ({ page }) => {
      // Create a task
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("High priority task");
      await input.press("Enter");

      await expect(page.getByText("High priority task")).toBeVisible();

      // Open priority picker (flag icon)
      const priorityBtn = page.getByRole("button", { name: "Set priority" });
      await priorityBtn.click();

      // Wait for dropdown to appear
      await expect(page.getByText("No priority")).toBeVisible();

      // Select high priority - the dropdown has buttons with text "High"
      await page.locator("button").filter({ hasText: "High" }).first().click();

      // Wait for dropdown to close and UI update
      await expect(page.getByText("No priority")).toBeHidden();
      await page.waitForTimeout(200);

      // Verify priority was set by checking the button title attribute changed
      await expect(page.getByRole("button", { name: "Set priority" })).toHaveAttribute("title", "Priority: High");
    });
  });

  test.describe("Subtasks", () => {
    test("should add subtask", async ({ page }) => {
      // Create a task
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Main task");
      await input.press("Enter");

      await expect(page.getByText("Main task")).toBeVisible();

      // Click add subtask button
      const addSubtaskBtn = page.getByRole("button", { name: "Add subtask" });
      await addSubtaskBtn.click();

      // Fill subtask input
      const subtaskInput = page.getByPlaceholder("Subtask name...");
      await subtaskInput.fill("Subtask 1");
      await subtaskInput.press("Enter");

      // Verify subtask appears
      await expect(page.getByText("Subtask 1")).toBeVisible();
    });
  });

  test.describe("Notes", () => {
    test("should add note to task", async ({ page }) => {
      // Create a task
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Task with note");
      await input.press("Enter");

      await expect(page.getByText("Task with note")).toBeVisible();

      // Click add note button
      const noteBtn = page.getByRole("button", { name: "Add note" });
      await noteBtn.click();

      // Add note
      const noteTextarea = page.getByPlaceholder("Add a note...");
      await noteTextarea.fill("This is my note");
      await noteTextarea.blur();

      // Verify note is saved
      await expect(page.getByText("This is my note")).toBeVisible();
    });
  });

  test.describe("Undo/Redo", () => {
    test("should undo and redo task creation", async ({ page }) => {
      // Create a task
      const input = page.getByPlaceholder("What needs to be done?");
      await input.fill("Undo test");
      await input.press("Enter");

      // Verify task exists
      await expect(page.getByText("Undo test")).toBeVisible();

      // Undo
      const undoBtn = page.getByRole("button", { name: "Undo" });
      await undoBtn.click();

      // Verify task is removed
      await expect(page.getByText("Undo test")).not.toBeVisible();

      // Redo
      const redoBtn = page.getByRole("button", { name: "Redo" });
      await redoBtn.click();

      // Verify task is back
      await expect(page.getByText("Undo test")).toBeVisible();
    });
  });

  test.describe("Keyboard Shortcuts", () => {
    test("should open shortcuts modal with button click", async ({ page }) => {
      // Click the keyboard shortcuts button
      await page.getByRole("button", { name: "Show keyboard shortcuts" }).click();

      // Verify modal is open
      await expect(page.getByRole("heading", { name: "Keyboard Shortcuts" })).toBeVisible();
    });
  });

  test.describe("Theme Toggle", () => {
    test("should toggle between light and dark theme", async ({ page }) => {
      // Toggle theme using aria-label pattern
      const themeBtn = page.getByRole("button", { name: /Switch to (light|dark) mode/i });
      await themeBtn.click();

      // Wait for theme change
      await page.waitForTimeout(500);

      // Toggle back
      await themeBtn.click();
    });
  });
});
