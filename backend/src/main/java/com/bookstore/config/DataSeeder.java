package com.bookstore.config;

import com.bookstore.entity.Book;
import com.bookstore.entity.Category;
import com.bookstore.repository.BookRepository;
import com.bookstore.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    @Override
    public void run(String... args) throws Exception {
        if (bookRepository.count() == 0) {
            seedData();
        }
    }

    private void seedData() {
        try {
            // Fiction (Target ~30%) - 3 Categories
            Category fiction = createCategory("Fiction", "fiction", "Fictional novels and stories");
            Category mystery = createCategory("Mystery", "mystery", "Detective stories and crime solving");
            Category fantasy = createCategory("Fantasy", "fantasy", "Magic, wizards, and epic adventures");

            // Non-Fiction (Target ~70%) - 7 Categories
            // "Atomic Habits", "Think and Grow Rich" -> Self-Help, Business, Psychology
            Category business = createCategory("Business", "business", "Economics, management, and finance");
            Category selfHelp = createCategory("Self-Help", "self-help", "Personal development and success");
            Category psychology = createCategory("Psychology", "psychology", "Human behavior and mind");
            Category philosophy = createCategory("Philosophy", "philosophy", "Wisdom and thought");
            Category nonFiction = createCategory("Non-Fiction", "non-fiction", "Real-world stories and facts");
            Category finance = createCategory("Finance", "finance", "Money management and investing");
            Category biography = createCategory("Biography", "biography", "Life stories of great people");
            // Science
            Category science = createCategory("Science", "science", "Exploration of the natural and physical world");
            // History
            Category history = createCategory("History", "history", "Study of past events and human civilization");

            // 3 Fiction + 7 Non-Fiction = 10 Categories. ~30/70 split.
            List<Category> categories = Arrays.asList(
                    fiction, mystery, fantasy,
                    business, selfHelp, psychology, philosophy, nonFiction, finance, biography, science, history);

            // Fetch and save books for each category
            for (Category category : categories) {
                fetchAndSaveBooks(category);
            }

            // Explicitly add user requested books
            fetchAndSaveSpecificBook("Atomic Habits", selfHelp);
            fetchAndSaveSpecificBook("Think and Grow Rich", business);
            fetchAndSaveSpecificBook("Rich Dad Poor Dad", finance);
            fetchAndSaveSpecificBook("The Psychology of Money", finance);

            // Science
            createBookIfNotFound(bookRepository, "A Brief History of Time", "Stephen Hawking", "Science",
                    "A landmark volume in science writing by one of the great minds of our time.",
                    "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=300&q=80",
                    18.99);
            createBookIfNotFound(bookRepository, "Cosmos", "Carl Sagan", "Science",
                    "The story of fifteen billion years of cosmic evolution.",
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
                    16.50);
            createBookIfNotFound(bookRepository, "The Gene: An Intimate History", "Siddhartha Mukherjee", "Science",
                    "The story of the gene and how it has shaped our understanding of life.",
                    "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=300&q=80",
                    22.00);

            // History
            createBookIfNotFound(bookRepository, "Sapiens: A Brief History of Humankind", "Yuval Noah Harari",
                    "History",
                    "A summer reading pick for President Barack Obama, Bill Gates, and Mark Zuckerberg.",
                    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80", 24.99);
            createBookIfNotFound(bookRepository, "Guns, Germs, and Steel", "Jared Diamond", "History",
                    "A transnational account of how civilization has developed over the last 13,000 years.",
                    "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=300&q=80",
                    19.95);
            createBookIfNotFound(bookRepository, "The Silk Roads", "Peter Frankopan", "History",
                    "A new history of the world, illuminating the forces that have driven the rise and fall of empires.",
                    "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=300&q=80",
                    21.50);

            // Non-Fiction
            createBookIfNotFound(bookRepository, "Educated", "Tara Westover", "Non-Fiction",
                    "An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD.",
                    "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=300&q=80",
                    17.99);
            createBookIfNotFound(bookRepository, "Becoming", "Michelle Obama", "Non-Fiction",
                    "An intimate, powerful, and inspiring memoir by the former First Lady of the United States.",
                    "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80", 25.00);
            createBookIfNotFound(bookRepository, "Thinking, Fast and Slow", "Daniel Kahneman", "Non-Fiction",
                    "The major New York Times bestseller that changes the way we think.",
                    "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=300&q=80",
                    15.99);

            System.out.println("✅ Database seeded with data from Google Books API.");
            System.out.println("Seeding complete!");
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Failed to seed data from API. Falling back to static data.");
            // Fallback could be implemented here if needed, but for now we log error.
        }
    }

    private Category createCategory(String name, String slug, String description) {
        return categoryRepository.findBySlug(slug)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(name);
                    c.setSlug(slug);
                    c.setDescription(description);
                    return categoryRepository.save(c);
                });
    }

    private void fetchAndSaveBooks(Category category) {
        try {
            String query = "subject:" + category.getName();
            String url = "https://www.googleapis.com/books/v1/volumes?q=" + query
                    + "&maxResults=10&langRestrict=en&printType=books";

            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create(url))
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> response = client.send(request,
                    java.net.http.HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(response.body());
                com.fasterxml.jackson.databind.JsonNode items = root.path("items");

                if (items.isArray()) {
                    for (com.fasterxml.jackson.databind.JsonNode item : items) {
                        processBookNode(item, category);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching books for " + category.getName() + ": " + e.getMessage());
        }
    }

    private void fetchAndSaveSpecificBook(String titleQuery, Category category) {
        try {
            // Encode query safely (simple replacement for now)
            String encodedQuery = java.net.URLEncoder.encode(titleQuery, java.nio.charset.StandardCharsets.UTF_8);
            String url = "https://www.googleapis.com/books/v1/volumes?q=" + encodedQuery
                    + "&maxResults=1&langRestrict=en&printType=books";

            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create(url))
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> response = client.send(request,
                    java.net.http.HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                com.fasterxml.jackson.databind.JsonNode root = mapper.readTree(response.body());
                com.fasterxml.jackson.databind.JsonNode items = root.path("items");

                if (items.isArray() && items.size() > 0) {
                    processBookNode(items.get(0), category);
                }
            }
        } catch (Exception e) {
            System.err.println("Error fetching specific book " + titleQuery + ": " + e.getMessage());
        }
    }

    private void processBookNode(com.fasterxml.jackson.databind.JsonNode item, Category category) {
        try {
            com.fasterxml.jackson.databind.JsonNode info = item.path("volumeInfo");
            com.fasterxml.jackson.databind.JsonNode sale = item.path("saleInfo");

            String title = info.path("title").asText();
            if (title.length() > 255)
                title = title.substring(0, 255);

            String author = "Unknown";
            if (info.path("authors").isArray() && info.path("authors").size() > 0) {
                author = info.path("authors").get(0).asText();
            }

            String description = info.path("description").asText();
            if (description.length() > 2000)
                description = description.substring(0, 1997) + "...";
            if (description.isEmpty())
                description = "No description available.";

            String imageUrl = null;
            if (info.has("imageLinks")) {
                imageUrl = info.path("imageLinks").path("thumbnail").asText();
                if (imageUrl != null)
                    imageUrl = imageUrl.replace("http://", "https://");
            }

            BigDecimal price;
            if (sale.has("listPrice")) {
                price = new BigDecimal(sale.path("listPrice").path("amount").asText());
            } else {
                price = BigDecimal.valueOf(10 + Math.random() * 40);
            }

            Book book = new Book();
            book.setTitle(title);
            book.setAuthor(author);
            book.setDescription(description);
            book.setPrice(price);
            book.setStockQuantity(20 + (int) (Math.random() * 80));
            book.setCategory(category);
            book.setCoverImageUrl(imageUrl);
            // Rating starts at 0, increases when users add reviews
            book.setRatingAverage(0.0);
            book.setRatingCount(0);

            bookRepository.save(book);
        } catch (Exception e) {
            System.err.println("Skipping book due to error: " + e.getMessage());
        }
    }

    private void createBookIfNotFound(BookRepository bookRepository, String title, String author, String categoryName,
            String description, String imageUrl, double price) {
        if (bookRepository.findByTitleContainingIgnoreCase(title).isEmpty()) {
            Category category = categoryRepository.findByName(categoryName)
                    .orElseGet(() -> createCategory(categoryName, categoryName.toLowerCase(),
                            "Books about " + categoryName));

            Book book = new Book();
            book.setTitle(title);
            book.setAuthor(author);
            book.setCategory(category);
            book.setDescription(description);
            book.setCoverImageUrl(imageUrl);
            book.setPrice(BigDecimal.valueOf(price));
            book.setStockQuantity(50);
            // Rating starts at 0, increases when users add reviews
            book.setRatingAverage(0.0);
            book.setRatingCount(0);

            bookRepository.save(book);
        }
    }
}
