```javascript
// ============================================
// ZOHRAN'S REAL KITCHEN
// Main Game Engine
// ============================================

"use strict";

// FOOD RECIPES

const recipes = {
    "Burger": {
        ingredients: ["bun", "patty", "cheese", "lettuce", "tomato"],
        emoji: "🍔",
        price: 25
    },

    "Cheeseburger": {
        ingredients: ["bun", "patty", "cheese"],
        emoji: "🍔",
        price: 20
    },

    "Pizza": {
        ingredients: ["dough", "sauce", "cheese", "tomato"],
        emoji: "🍕",
        price: 30
    },

    "Fries": {
        ingredients: ["fries"],
        emoji: "🍟",
        price: 12
    },

    "Cold Drink": {
        ingredients: ["drink"],
        emoji: "🥤",
        price: 8
    }
};

// CUSTOMER CHARACTERS

const people = [
    { name: "Alex", emoji: "👨🏻", order: "Burger" },
    { name: "Sophia", emoji: "👩🏼", order: "Pizza" },
    { name: "Daniel", emoji: "👨🏽", order: "Fries" },
    { name: "Emma", emoji: "👩🏻", order: "Cheeseburger" },
    { name: "Oliver", emoji: "👨🏿", order: "Cold Drink" },
    { name: "Mia", emoji: "👩🏽", order: "Pizza" },
    { name: "Noah", emoji: "👨🏼", order: "Burger" },
    { name: "Ava", emoji: "👩🏾", order: "Fries" }
];

// GAME VARIABLES

let customers = [];
let selectedCustomer = -1;

let ingredients = [];
let cookedFood = null;

let cooking = false;
let money = 0;
let score = 0;
let day = 1;

let nextCustomerId = 0;
let cookingTimer = null;

// GET HTML ELEMENTS

const customerArea = document.getElementById("customers");
const message = document.getElementById("message");

const moneyDisplay = document.getElementById("money");
const scoreDisplay = document.getElementById("score");
const dayDisplay = document.getElementById("day");

const foodDisplay = document.getElementById("foodDisplay");
const dishName = document.getElementById("dishName");
const statusDisplay = document.getElementById("status");

const cookButton = document.getElementById("cookButton");
const serveButton = document.getElementById("serveButton");
const clearButton = document.getElementById("clearButton");

// SHOW GAME MESSAGE

function showMessage(text) {
    if (message) {
        message.textContent = text;
    }
}

// UPDATE MONEY AND SCORE

function updateStats() {
    moneyDisplay.textContent = money;
    scoreDisplay.textContent = score;
    dayDisplay.textContent = day;
}

// CREATE A CUSTOMER

function newCustomer() {
    const person = people[
        Math.floor(Math.random() * people.length)
    ];

    return {
        id: nextCustomerId++,
        name: person.name,
        emoji: person.emoji,
        order: person.order,
        patience: 100,
        served: false
    };
}

// ADD A CUSTOMER

function addCustomer() {
    if (customers.length >= 5) {
        return;
    }

    customers.push(newCustomer());

    if (selectedCustomer === -1) {
        selectedCustomer = customers.findIndex(
            customer => !customer.served
        );
    }

    renderCustomers();
}

// DISPLAY CUSTOMERS

function renderCustomers() {
    customerArea.innerHTML = "";

    customers.forEach((customer, index) => {
        const card = document.createElement("div");

        card.className = "customer";

        if (index === selectedCustomer) {
            card.classList.add("active");
        }

        if (customer.served) {
            card.style.opacity = "0.55";
        }

        const orderText = customer.served
            ? "✅ Order completed!"
            : "Wants " + recipes[customer.order].emoji +
              "<br>" + customer.order;

        card.innerHTML = `
            <div class="person">${customer.emoji}</div>

            <strong>${customer.name}</strong>

            <div class="order">
                ${orderText}
            </div>

            <div class="patience">
                <div
                    class="patience-fill"
                    style="
                        width: ${customer.patience}%;
                        background: ${
                            customer.patience < 30
                                ? '#ff5555'
                                : '#45ce75'
                        };
                    "
                ></div>
            </div>

            <button
                class="main-button"
                style="margin-top:10px"
                ${customer.served ? "disabled" : ""}
            >
                ${customer.served ? "Finished" : "Select Order"}
            </button>
        `;

        const selectButton = card.querySelector("button");

        selectButton.addEventListener("click", () => {
            selectCustomer(index);
        });

        customerArea.appendChild(card);
    });
}

// SELECT A CUSTOMER

function selectCustomer(index) {
    const customer = customers[index];

    if (!customer || customer.served) {
        return;
    }

    if (cooking) {
        showMessage(
            "🔥 Wait until your food finishes cooking!"
        );
        return;
    }

    selectedCustomer = index;

    ingredients = [];
    cookedFood = null;

    updateKitchen();
    renderCustomers();

    showMessage(
        customer.name + " ordered " +
        customer.order + "! Let's cook!"
    );
}

// UPDATE COOKING STATION

function updateKitchen() {
    document.querySelectorAll(".ingredient").forEach(button => {
        button.classList.toggle(
            "selected",
            ingredients.includes(button.dataset.item)
        );
    });

    if (cooking) {
        foodDisplay.textContent = "🔥";
        dishName.textContent = "Cooking...";
        statusDisplay.textContent =
            "Your food is cooking. Please wait!";
        return;
    }

    if (cookedFood) {
        foodDisplay.textContent = cookedFood.emoji;
        dishName.textContent = cookedFood.name;
        statusDisplay.textContent =
            "Your food is ready! Serve it to the customer.";
        return;
    }

    if (ingredients.length > 0) {
        foodDisplay.textContent = "🥗";

        dishName.textContent =
            ingredients.length + " ingredient(s) selected";

        statusDisplay.textContent =
            "Choose the correct ingredients, then cook!";
    } else {
        foodDisplay.textContent = "🍳";
        dishName.textContent = "Empty Cooking Station";
        statusDisplay.textContent =
            "Select a customer and choose ingredients.";
    }
}

// SELECT INGREDIENTS

document.querySelectorAll(".ingredient").forEach(button => {
    button.addEventListener("click", () => {
        if (cooking || cookedFood) {
            showMessage(
                "Finish cooking or clear the station first!"
            );
            return;
        }

        const item = button.dataset.item;

        if (ingredients.includes(item)) {
            ingredients = ingredients.filter(
                ingredient => ingredient !== item
            );
        } else {
            ingredients.push(item);
        }

        updateKitchen();
    });
});

// COOK FOOD

function cookFood() {
    if (cooking) {
        return;
    }

    const customer = customers[selectedCustomer];

    if (!customer || customer.served) {
        showMessage("Select an active customer first!");
        return;
    }

    if (cookedFood) {
        showMessage(
            "Your food is already ready! Serve it first."
        );
        return;
    }

    const recipe = recipes[customer.order];

    const correctIngredients =
        ingredients.length === recipe.ingredients.length &&
        recipe.ingredients.every(
            ingredient => ingredients.incl
```
