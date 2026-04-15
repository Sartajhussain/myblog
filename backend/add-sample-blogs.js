import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Blog } from './models/blog.model.js';
import User from './models/user.model.js';

dotenv.config();

const sampleBlogs = [
  {
    title: "Getting Started with MongoDB",
    subtitle: "Learn MongoDB basics",
    description: "MongoDB is a popular NoSQL database. In this tutorial, we'll cover the basics of MongoDB and how to use it in your applications.",
    category: "Database",
    isPublished: true,
  },
  {
    title: "React Hooks: A Complete Guide",
    subtitle: "Master React Hooks",
    description: "React Hooks allow you to use state and other React features without writing a class. Learn about useState, useEffect, and custom hooks.",
    category: "Frontend",
    isPublished: true,
  },
  {
    title: "Express.js Best Practices",
    subtitle: "Build scalable APIs",
    description: "Express.js is a fast and minimalist web framework for Node.js. Learn best practices for building robust and scalable APIs.",
    category: "Backend",
    isPublished: true,
  },
  {
    title: "JavaScript ES6 Features",
    subtitle: "Modern JavaScript",
    description: "ES6 introduced many new features to JavaScript including arrow functions, classes, and template literals. Discover what's new.",
    category: "JavaScript",
    isPublished: true,
  },
  {
    title: "Full Stack Development Guide",
    subtitle: "Frontend to Backend",
    description: "Full stack development involves working on both client-side and server-side applications. Learn the complete workflow.",
    category: "General",
    isPublished: true,
  }
];

async function addSampleBlogs() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get or create a test user
    let user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      user = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'hashedpassword'
      });
      console.log('✅ Created test user');
    }

    // Check existing blogs
    const existingCount = await Blog.countDocuments();
    console.log(`📊 Existing blogs: ${existingCount}`);

    // Add sample blogs
    for (const blogData of sampleBlogs) {
      const exists = await Blog.findOne({ title: blogData.title });
      if (!exists) {
        await Blog.create({
          ...blogData,
          author: user._id,
          likes: [],
          comments: []
        });
        console.log(`✅ Added: ${blogData.title}`);
      } else {
        console.log(`⏭️  Already exists: ${blogData.title}`);
      }
    }

    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ isPublished: true });
    
    console.log(`\n📈 Total blogs: ${totalBlogs}`);
    console.log(`✅ Published blogs: ${publishedBlogs}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

addSampleBlogs();
