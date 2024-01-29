package com.eni.backend.problem.dto.response;

import com.eni.backend.problem.entity.Problem;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
public class GetProblemResponse {

    private Long problemId;
    private String tier;
    private String platform;
    private Integer no;
    private String title;
    private String description;
    private String input;
    private String output;
    private String time;
    private String memory;

    @Builder
    public GetProblemResponse(Long problemId, String tier, String platform, Integer no, String title, String description, String input, String output, String time, String memory) {
        this.problemId = problemId;
        this.tier = tier;
        this.platform = platform;
        this.no = no;
        this.title = title;
        this.description = description;
        this.input = input;
        this.output = output;
        this.time = time;
        this.memory = memory;
    }

    public static GetProblemResponse of(Problem problem) {
        return builder()
                .problemId(problem.getId())
                .tier(problem.getStringTier())
                .platform(problem.getStringPlatform())
                .no(problem.getNo())
                .title(problem.getTitle())
                .description(problem.getDescription())
                .input(problem.getInput())
                .output(problem.getOutput())
                .time(problem.getStringTime())
                .memory(problem.getStringMemory())
                .build();
    }

}
