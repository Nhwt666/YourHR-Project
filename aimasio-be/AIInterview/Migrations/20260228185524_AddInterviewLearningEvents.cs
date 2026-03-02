using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AIInterview.Migrations
{
    /// <inheritdoc />
    public partial class AddInterviewLearningEvents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "InterviewLearningEvents",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SessionId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TurnIndex = table.Column<int>(type: "integer", nullable: false),
                    Mode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CurrentQuestion = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    CurrentQuestionDescription = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    CandidateText = table.Column<string>(type: "character varying(10000)", maxLength: 10000, nullable: false),
                    SectionTranscript = table.Column<string>(type: "character varying(30000)", maxLength: 30000, nullable: false),
                    AiReply = table.Column<string>(type: "character varying(8000)", maxLength: 8000, nullable: false),
                    CriticPass = table.Column<bool>(type: "boolean", nullable: false),
                    CriticIssues = table.Column<string>(type: "character varying(8000)", maxLength: 8000, nullable: false),
                    CriticSuggestion = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    PlannerJson = table.Column<string>(type: "character varying(20000)", maxLength: 20000, nullable: false),
                    CriticJson = table.Column<string>(type: "character varying(12000)", maxLength: 12000, nullable: false),
                    UserRating = table.Column<int>(type: "integer", nullable: true),
                    UserFeedback = table.Column<string>(type: "character varying(3000)", maxLength: 3000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InterviewLearningEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InterviewLearningEvents_InterviewSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "InterviewSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InterviewLearningEvents_SessionId_CreatedAt",
                table: "InterviewLearningEvents",
                columns: new[] { "SessionId", "CreatedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InterviewLearningEvents");
        }
    }
}
