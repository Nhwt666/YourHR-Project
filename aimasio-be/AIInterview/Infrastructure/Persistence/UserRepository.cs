using AIInterview.Application.Interfaces;
using AIInterview.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AIInterview.Infrastructure.Persistence;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;

    public UserRepository(AppDbContext db) => _db = db;

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
        => _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email, cancellationToken);

    public async Task<User> CreateAsync(User user, CancellationToken cancellationToken = default)
    {
        _db.Users.Add(user);
        await _db.SaveChangesAsync(cancellationToken);
        return user;
    }
}
