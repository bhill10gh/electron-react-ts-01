using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using SqliteDAL.Data;

var builder = WebApplication.CreateBuilder(args);

// Register SQLite database
builder.Services.AddDbContext<Mp3DbContext>(options =>
    options.UseSqlite(
        builder.Configuration.GetConnectionString("Mp3Database")
    )
);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "API Service",
        Version = "v1",
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "API Service v1");
    });
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/health", () => Results.Ok(new
{
    Status = "Running"
}));

app.Run();
