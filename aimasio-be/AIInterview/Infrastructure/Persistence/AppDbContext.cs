using AIInterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AIInterview.Infrastructure.Persistence;

/// <summary>
/// EF Core DbContext. All EF-specific config is here; Domain stays clean.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<InterviewSession> InterviewSessions => Set<InterviewSession>();
    public DbSet<InterviewQuestion> InterviewQuestions => Set<InterviewQuestion>();
    public DbSet<InterviewAnswer> InterviewAnswers => Set<InterviewAnswer>();
    public DbSet<InterviewLearningEvent> InterviewLearningEvents => Set<InterviewLearningEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Fluent API only; no data annotations in Domain entities
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Email).HasMaxLength(256).IsRequired();
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.PasswordHash).HasMaxLength(500).IsRequired();
        });

        modelBuilder.Entity<InterviewSession>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.JobRole).HasMaxLength(200).IsRequired();
            e.HasOne<User>().WithMany().HasForeignKey(x => x.UserId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<InterviewQuestion>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.QuestionText).HasMaxLength(2000);
            e.Property(x => x.Description).HasMaxLength(1000);
            e.HasOne<InterviewSession>().WithMany().HasForeignKey(x => x.SessionId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<InterviewAnswer>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.QuestionText).HasMaxLength(2000);
            e.Property(x => x.Transcript).HasMaxLength(10000);
            e.Property(x => x.Feedback).HasMaxLength(5000);
            e.HasOne<InterviewSession>().WithMany().HasForeignKey(x => x.SessionId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<InterviewLearningEvent>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Mode).HasMaxLength(50);
            e.Property(x => x.CurrentQuestion).HasMaxLength(2000);
            e.Property(x => x.CurrentQuestionDescription).HasMaxLength(1000);
            e.Property(x => x.CandidateText).HasMaxLength(10000);
            e.Property(x => x.SectionTranscript).HasMaxLength(30000);
            e.Property(x => x.AiReply).HasMaxLength(8000);
            e.Property(x => x.CriticIssues).HasMaxLength(8000);
            e.Property(x => x.CriticSuggestion).HasMaxLength(4000);
            e.Property(x => x.PlannerJson).HasMaxLength(20000);
            e.Property(x => x.CriticJson).HasMaxLength(12000);
            e.Property(x => x.UserFeedback).HasMaxLength(3000);
            e.HasOne<InterviewSession>().WithMany().HasForeignKey(x => x.SessionId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => new { x.SessionId, x.CreatedAt });
        });
    }
}
